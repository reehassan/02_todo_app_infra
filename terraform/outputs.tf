output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = module.ec2.ec2_public_ip
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.rds_endpoint
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_id" {
  description = "Public subnet ID"
  value       = module.vpc.public_subnet_id
}

output "private_subnet_id" {
  description = "Private subnet ID"
  value       = module.vpc.private_subnet_id
}

output "ssh_instructions" {
  description = "Instructions to SSH into EC2 instance"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${module.ec2.ec2_public_ip}"
}