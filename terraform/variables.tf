variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource tagging"
  default     = "todo-app"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for the private subnet"
  default     = "10.0.2.0/24"
}

variable "db_username" {
  description = "RDS database username"
  default     = "todouser"
  sensitive   = true
}

variable "db_password" {
  description = "RDS database password"
  sensitive   = true
}

variable "key_name" {
  description = "Name of the EC2 key pair"
  default     = "todo-app-key"
}
