-- create database
CREATE DATABASE lockn;

-- user table
CREATE TABLE users (
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
CREATE TABLE roles (
  role_id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE COMMENT '角色名'
);

-- 用户-角色关联表
CREATE TABLE user_roles (
  user_id BIGINT UNSIGNED NOT NULL,  -- 关联用户表ID
  role_id INT NOT NULL,              -- 关联角色ID
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);