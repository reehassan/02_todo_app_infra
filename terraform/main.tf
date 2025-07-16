
module "vpc" {
  source              = "./modules/vpc"
  project_name        = var.project_name
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidr  = var.public_subnet_cidr
  private_subnet_cidr = var.private_subnet_cidr
  aws_region          = var.aws_region
}

module "sg" {
  source       = "./modules/sg"
  project_name = var.project_name
  vpc_id       = module.vpc.vpc_id
}

module "rds" {
  source             = "./modules/rds"
  project_name       = var.project_name
  private_subnet_ids = [module.vpc.private_subnet_id, module.vpc.private_subnet_id2]
  rds_sg_id          = module.sg.rds_sg_id
  db_username        = var.db_username
  db_password        = var.db_password
}

module "ec2" {
  source            = "./modules/ec2"
  project_name      = var.project_name
  public_subnet_id  = module.vpc.public_subnet_id
  ec2_sg_id         = module.sg.ec2_sg_id
  key_name          = var.key_name
  rds_endpoint      = module.rds.rds_endpoint
  db_username       = var.db_username
  db_password       = var.db_password
}