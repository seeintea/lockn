-- create database
CREATE DATABASE lockn;

-- 操作日志
CREATE TABLE bs_operation_logs (
  log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  action VARCHAR(50) NOT NULL COMMENT '操作类型',
  target_id VARCHAR(100) COMMENT '操作对象ID',
  detail TEXT COMMENT '操作详情',
  ip VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE bs_users (
  id BIGINT UNSIGNED PRIMARY KEY COMMENT '雪花ID',
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password CHAR(64) NOT NULL COMMENT '加密密码',
  salt CHAR(32) NOT NULL COMMENT '盐值',
  status ENUM('active','inactive','locked') DEFAULT 'active' COMMENT '状态',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
  phone VARCHAR(20) UNIQUE COMMENT '手机号',
  nickname VARCHAR(50) DEFAULT '' COMMENT '昵称',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  is_deleted TINYINT UNSIGNED DEFAULT 0 COMMENT '逻辑删除标记（0-未删除）',
  delete_time TIMESTAMP NULL COMMENT '删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 角色表
CREATE TABLE bs_roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名'
);

-- 用户-角色关联表
CREATE TABLE bs_user_roles (
  user_id BIGINT UNSIGNED NOT NULL,  -- 关联用户表ID
  role_id INT NOT NULL,              -- 关联角色ID
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES bs_users(id),
  FOREIGN KEY (role_id) REFERENCES bs_roles(role_id)
);

-- 权限表
CREATE TABLE bs_permissions (
  permission_id INT AUTO_INCREMENT PRIMARY KEY,
  permission_code VARCHAR(50) NOT NULL UNIQUE COMMENT '权限标识符(如:user:create)',
  description VARCHAR(255) NOT NULL COMMENT '权限描述'
);

-- 角色-权限关联表
CREATE TABLE bs_role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES bs_roles(role_id),
  FOREIGN KEY (permission_id) REFERENCES bs_permissions(permission_id)
);

-- 路由表（存储前端路由信息）
CREATE TABLE bs_routes (
  route_id INT AUTO_INCREMENT PRIMARY KEY,
  path VARCHAR(255) NOT NULL UNIQUE COMMENT '路由路径',
  name VARCHAR(50) NOT NULL COMMENT '路由名称',
  component VARCHAR(255) NOT NULL COMMENT '前端组件路径',
  meta_data JSON NOT NULL COMMENT '路由元信息',
  parent_id INT DEFAULT 0 COMMENT '父路由ID',
  order_num INT DEFAULT 0 COMMENT '排序号',
  is_menu TINYINT(1) DEFAULT 0 COMMENT '是否菜单项（1-是，0-否）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='前端路由表';

-- 角色-路由关联表（控制路由访问权限）
CREATE TABLE bs_role_routes (
  role_id INT NOT NULL,
  route_id INT NOT NULL,
  PRIMARY KEY (role_id, route_id),
  FOREIGN KEY (role_id) REFERENCES bs_roles(role_id),
  FOREIGN KEY (route_id) REFERENCES bs_routes(route_id)
);

-- 按钮权限表
CREATE TABLE bs_button_permissions (
  button_id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL COMMENT '关联的路由ID',
  button_key VARCHAR(50) NOT NULL COMMENT '按钮唯一标识',
  button_name VARCHAR(50) NOT NULL COMMENT '按钮显示名称',
  permission_code VARCHAR(50) NOT NULL COMMENT '关联的权限标识',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (route_id, button_key),
  FOREIGN KEY (route_id) REFERENCES bs_routes(route_id)
) COMMENT='按钮权限配置表';