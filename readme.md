# PAW - School Management System

## Database Entity Relationship Diagram

```mermaid
erDiagram
    USER {
        int id_user PK "🔑 Primary Key"
        string username "👤 Login Username"
        string password "🔒 Encrypted Password"
        string role "🎭 User Role (admin/teacher)"
    }
    
    TEACHER {
        int id_teacher PK "🔑 Primary Key"
        string full_name "👨‍🏫 Teacher Full Name"
        int id_user FK "🔗 Foreign Key to USER"
    }
    
    STUDENT {
        int id_student PK "🔑 Primary Key"
        string full_name "👨‍🎓 Student Full Name"
        string matricule "🎫 Student ID Number"
        int id_group FK "🔗 Foreign Key to GROUPS"
    }
    
    GROUPS {
        int id_group PK "🔑 Primary Key"
        string group_name "👥 Class Group Name"
    }
    
    MODULE {
        int id_module PK "🔑 Primary Key"
        string module_name "📚 Course Module Name"
        string course_code "🏷️ Course Code"
    }
    
    SESSION {
        int id_session PK "🔑 Primary Key"
        date session_date "📅 Session Date"
        time start_time "⏰ Start Time"
        time end_time "🕐 End Time"
        string session_type "📝 Type (TD/TP)"
        int id_teacher FK "🔗 Foreign Key to TEACHER"
        int id_group FK "🔗 Foreign Key to GROUPS"
        int id_module FK "🔗 Foreign Key to MODULE"
    }

    ABSENCE {
        int id_absence PK "🔑 Primary Key"
        int id_student FK "🔗 Foreign Key to STUDENT"
        int id_session FK "🔗 Foreign Key to SESSION"
        datetime recorded_at "⏰ Timestamp Recorded"
        string status "📊 Attendance Status (present/absent/late)"
    }




## System Overview

### 🏗️ **Architecture**
- **Frontend**: HTML, CSS, JavaScript (jQuery)
- **Backend**: PHP with PostgreSQL
- **Authentication**: Session-based with localStorage
- **Role Management**: Admin and Teacher roles

### 👥 **User Roles**

#### 🔴 **Admin**
- Manage teachers and students
- Create and assign groups
- Manage modules and sessions
- Full system access

#### 🟢 **Teacher**
- View assigned sessions
- Take attendance
- Manage class activities

### 📊 **Database Relationships**

#### **Core Entities:**
1. **🔐 USER** - Authentication and role management
2. **👨‍🏫 TEACHER** - Teacher information linked to user accounts
3. **👨‍🎓 STUDENT** - Student details with group assignments
4. **👥 GROUPS** - Class organizations
5. **📚 MODULE** - Course subjects
6. **📝 SESSION** - Class meetings connecting teachers, groups, and modules

#### **Key Relationships:**
- **One-to-One**: USER ↔ TEACHER (Each teacher has one user account)
- **One-to-Many**: GROUPS ↔ STUDENT (Groups contain multiple students)
- **Many-to-Many**: TEACHER ↔ MODULE (via SESSION table)
- **Central Hub**: SESSION table connects all teaching activities

### 🚀 **Features**
- **Student Management**: Add, edit, delete, and group assignment
- **Teacher Management**: Account creation and session assignment  
- **Session Scheduling**: Create timetabled classes with date/time
- **Group Management**: Organize students into classes
- **Module Management**: Course subject organization
- **Attendance Tracking**: Teacher-led attendance recording

### 📁 **Project Structure**
```
paw/
├── 🔐 auth/           # Authentication system
├── 👑 admin/          # Admin dashboard
├── 👨‍🏫 teacher/       # Teacher interface  
├── 🌐 public/         # Login page
├── 🔌 api/            # REST API endpoints
└── ⚙️ config/         # Database configuration
```


- Users :

## Admin : 

    - username :"admin" 
    - password :"admin"

## Teacher :
    - username :"teacher" 
    - password :"teacher"

## LINK TO FIGMA DESIGN 

-LINK : "https://www.figma.com/design/7celhIVoVrq0GtMLd5Qjdt/Untitled?node-id=7-505"


## HOW TO OPEN THIS PROJECT : 
simply run the project with 
index.html located in public and voila! it will take you into login page which u will login with 
either 
    - Admin 
    or
    - Teacher 
with the accounts above 


which u will have different point vue and different UI based on each user Role 

- Admin have full control over the whole system that he can : 
    - 👥 **Student Management**
        - Create new student accounts
        - Edit student information (name, matricule)
        - Delete student records
        - Assign students to groups
        - View all student data
    
    - 👨‍🏫 **Teacher Management**
        - Create teacher accounts with user credentials
        - Edit teacher profiles and information
        - Delete teacher accounts
        - View all teacher data
        - Manage teacher-session assignments
    
    - 👥 **Group Management**
        - Create new class groups
        - Edit group names and details
        - Delete groups
        - Assign/reassign students to groups
        - View group compositions
    
    - 📚 **Module Management**
        - Create course modules
        - Edit module names and course codes
        - Delete modules
        - View all module information
    
    - 📝 **Session Management**
        - Create teaching sessions
        - Schedule sessions with date/time
        - Assign teachers to sessions
        - Assign groups to sessions
        - Link modules to sessions
        - Edit session details
        - Delete sessions
        - View complete session calendar
    
    - 🔧 **System Administration**
        - Full database access
        - User role management
        - System configuration
        - Data oversight and maintenance


and 
Where 
- Teacher can :
    - 📅 **Session Management**
        - View their assigned sessions
        - See session details (date, time, group, module)
        - Access session calendar/schedule
    
    - 📋 **Attendance Management**
        - Take attendance for their sessions
        - Mark students as present/absent/late
    
    - 👨‍🎓 **Student Information**
        - View students in their assigned groups
        - Access student profiles and matricule numbers
        - See student attendance patterns
    
    - 📚 **Class Activities**
        - Manage class sessions (TD/TP)
    
    - 🔍 **Limited Access**
        - Cannot create/edit/delete students
        - Cannot manage other teachers
        - Cannot create modules or groups
        - Focus on teaching and attendance tasks