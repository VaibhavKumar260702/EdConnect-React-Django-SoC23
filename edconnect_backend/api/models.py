from django.db import models

# Create your models here.

class Courses(models.Model):
    courseCode = models.CharField(max_length=6,default=None,primary_key=True)
    courseName = models.CharField(max_length=100,default = None)
    coursePrivateCode = models.CharField(max_length=10,default=None)
    professor = models.CharField(max_length=30, default=None)
    description = models.TextField(max_length=500, default=None,blank=True)
    credits = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.courseCode

class Admin_info(models.Model):
    Username = models.CharField(max_length=100,default='')
    Password = models.CharField(max_length=50,default='')

    def __str__(self):
        return self.Username
    
class Ta_info(models.Model):
    Name = models.CharField(max_length=100,default='')
    Roll = models.CharField(max_length=100,default='')
    Password = models.CharField(max_length=50,default='')
    course = models.ManyToManyField(Courses,null=True)
    privatecode = models.CharField(max_length=100,default='') #every TA has a private code (for student joining)

    def __str__(self):
        return self.Roll

class Student_info(models.Model):
    Name = models.CharField(max_length=100,default='')
    Roll = models.CharField(max_length=100,default='')
    Password = models.CharField(max_length=50,default='')
    # course = models.ManyToManyField(Courses,null=True)
    ta = models.ManyToManyField(Ta_info,null=True) #student can have many TAs

    def __str__(self):
        return self.Roll
    

class Attendance_sessions(models.Model):
    CourseCode = models.CharField(max_length=6,default='')
    Ta = models.ForeignKey(Ta_info,on_delete=models.CASCADE,default='')
    Date = models.DateField(auto_now_add=True)
    Start = models.TimeField(default='')

    def __str__(self):
        return  self.Ta.Name+" | "  + self.CourseCode +  " |  " + str(self.Date) + " |  " +  str(self.Start)
    
class Attendance_Records(models.Model):
    Session = models.ForeignKey(Attendance_sessions,on_delete=models.CASCADE,default='')
    Roll = models.CharField(max_length=100, default='')
    Attend_time = models.TimeField(default='')

    def __str__(self):
        return self.Roll + " |  " + self.Session.Ta.Name + " |  " + self.Session.CourseCode + " | "+ str(self.Session.Date)  + " | " + str(self.Attend_time)
    
