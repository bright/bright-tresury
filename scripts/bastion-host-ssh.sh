set -ex

if [[ -z "${DEPLOY_ENV}" ]]; then
    echo "DEPLOY_ENV is empty"
    exit 1
fi

export AWS_REGION=eu-central-1

# Fine bastion_host_instance_id bastion_host_az for bastion host of current user
read -r bastion_host_instance_id bastion_host_az <<<$(aws ec2 describe-instances \
  --filters Name=tag:Application,Values="treasury-app-${DEPLOY_ENV}" \
  --query "Reservations[0].Instances[0].[InstanceId,Placement.AvailabilityZone]" \
  --output text )

# Send current user ssh public key to bastion host so that it allows for connecting
aws ec2-instance-connect send-ssh-public-key \
  --instance-id "${bastion_host_instance_id}" \
  --instance-os-user ec2-user \
  --availability-zone "${bastion_host_az}" \
  --ssh-public-key "file://~/.ssh/id_rsa.pub"

local_port=5433

read -rp "Database endpoint hostname: " database_private_fqdn

# Open a tunnel through bastion host to database on port 5433
ssh -vvv -N -L "${local_port}:${database_private_fqdn}:5432" \
  -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no" \
  -o ProxyCommand="aws ssm start-session --target %h --document-name AWS-StartSSHSession --parameters portNumber=%p" \
  "ec2-user@${bastion_host_instance_id}"
