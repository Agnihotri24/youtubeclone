# 🎬 YouTube Clone Backend — Major Backend Project

Welcome to the **YouTube Clone Backend Development Series**!  
This repository documents the step-by-step progress and implementation details of building a full-featured video streaming platform inspired by YouTube, using **Node.js**, **Express**, and **MongoDB**.

Each day’s progress is logged below, with clear explanations of tasks, structure, and goals.

---

## 📅 Day 01 — Project Planning & Setup

Today marks the beginning of our journey to build a production-level YouTube backend clone.

### ✅ Goals Completed:
- Defined the **project scope** and identified key features.
- Drew a complete **roadmap** and **module breakdown**.
- Performed initial **project setup** and created the base folder structure.

---

### 📁 Directory Structure

* public
* src 
  * controllers
  * db
  * models
  * routes 
  * utils 

#### some files
* .env
* .gitignore
* .prettierrc
* .prettierignore

## 📅 Day 02 — Set up Error Handling API and Response Handling API

All the setup for Error, Response, and Handling Api inside utils folder for Error use Error class for Node and extend it and defing all the member and defining constructor and methode.

## 📅 Day 03 — Creating All Models & cloudinary Setup

### Creating Models
  * user.model
  * video.model
  * like.model
  * comment.model
  * playlist.model
  * subscribe.model

#### File Storing setup on clodinary
use clouding to store all file such image, video, pdf, ... etc using multer done all the setup like middleware, and utils for both case

## 📅 Day 04 — Multer Middleware & Routes setup
in the day 04 setup the multer middleware for uploading all the file at temporary and
set up the user route for handling all request at user routes and setup registered route

## 📅 Day 05 — Complete the registered controller and test with postman
in the day 5 create controller for registered the user with proper validation and uploading all files at cloudinary along with this handling cornor case.

## 📅 Day 06 — Creating Login & Logout Routes
In day 5 creating login and logout route with proper validation and implement the Access and refresh token 
with resding the ErrorApi and ResponseApi and testing with postman