resource "aws_instance" "app" {
  ami                    = "ami-0e86e20dae9224db8" # Ubuntu 22.04 LTS in us-east-1
  instance_type          = "t2.micro"
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.ec2_sg_id]
  key_name               = var.key_name

  user_data = templatefile("${path.module}/scripts/user_data.sh.tpl", {
    rds_endpoint   = var.rds_endpoint
    db_username    = var.db_username
    db_password    = var.db_password
  })

  tags = {
    Name = "${var.project_name}-ec2"
  }
}

resource "aws_eip" "app_eip" {
  vpc = true
  tags = {
    Name = "${var.project_name}-eip"
  }
}

resource "aws_eip_association" "app_eip_assoc" {
  instance_id   = aws_instance.app.id
  allocation_id = aws_eip.app_eip.id
}
