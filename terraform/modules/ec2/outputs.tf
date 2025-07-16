output "ec2_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.app.public_ip
}

output "app_eip" {
  description = "Elastic IP address attached to the EC2 instance"
  value       = aws_eip.app_eip.public_ip
}
