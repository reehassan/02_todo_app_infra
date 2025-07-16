
variable "project_name" {}
variable "private_subnet_ids" {
  type = list(string)
}
variable "rds_sg_id" {}
variable "db_username" {}
variable "db_password" {}
