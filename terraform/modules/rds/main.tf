
resource "aws_db_instance" "postgres" {
  identifier           = "${var.project_name}-db"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "13.16"
  username             = var.db_username
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_sg_id]
  skip_final_snapshot  = true
  tags = {
    Name = "${var.project_name}-rds"
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-subnet-group"
  subnet_ids = var.private_subnet_ids # Reference list of subnet IDs
  tags = {
    Name = "${var.project_name}-subnet-group"
  }
}