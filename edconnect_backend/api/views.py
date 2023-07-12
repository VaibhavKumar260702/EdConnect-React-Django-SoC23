from django.shortcuts import render
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import Admin_infoSerializer,Ta_infoSerializer,Student_infoSerializer
from .models import Admin_info,Ta_info,Student_info,Courses
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

@csrf_exempt
@api_view(['POST'])
def Student_login(request):
    #it return id of student if student is valid otherwise -1
    student_data = request.data 

    if(request.method=='POST'):
        roll = student_data['roll']
        password = student_data['password']
        student = Student_info.objects.filter(Roll = roll, Password = password)      
        if student.exists():
            return Response(student.first().id) 
    return Response(-1)


@csrf_exempt
@api_view(['POST'])
def Ta_login(request):
    #it return id of student if student is valid otherwise -1
    ta_data = request.data 

    if(request.method=='POST'):
        roll = ta_data['roll']
        password = ta_data['password']
        ta = Ta_info.objects.filter(Roll = roll, Password = password)        
        if ta.exists():
            return Response(ta.first().id) 
    return Response(-1)


@api_view(['POST'])
def Admin_login(request):
    #it return id of student if student is valid otherwise -1
    admin_data = request.data 

    if(request.method=='POST'):
        username = admin_data['username']
        password = admin_data['password']
        admin = Admin_info.objects.filter(Username = username, Password = password)        
        if admin.exists():
            return Response(admin.first().id) 
    return Response(-1)


@api_view(['POST'])
@csrf_exempt
def Student_register(request):

    student_data = request.data

    if request.method == "POST":
        student_name = student_data["name"]
        student_roll = student_data["roll"]
        student_pass = student_data["password"]

        student = Student_info.objects.filter(Roll = student_roll)  
        if student.exists():
            return Response(0)
        student = Student_info.objects.create(
            Name=student_name,
            Roll=student_roll,
            Password=student_pass
        )
        student.save()
        return Response(1)
    Response(0)

@csrf_exempt
@api_view(['GET'])
def Student_data(request,id):
    if request.method =="GET":
        student = Student_info.objects.filter(id=id)
        if student.exists():
            student_serializer = Student_infoSerializer(student.first(), many=False)
            return Response(student_serializer.data)
        else:
            return Response( 'No student with these credentials')
        
@csrf_exempt
@api_view(['GET'])       
def Student_courses_info(request,id):
    if request.method =="GET":
        courses= Student_info.objects.filter(id=id).first().course.values()
        return Response(courses)
    
@csrf_exempt
@api_view(['GET'])
def Ta_data(request,id):
    if request.method =="GET":
        ta = Ta_info.objects.filter(id=id)
        if ta.exists():
            ta_serializer = Ta_infoSerializer(ta.first(), many=False)
            return Response(ta_serializer.data)
        else:
            return Response( 'No ta with these credentials')

@csrf_exempt
@api_view(['GET'])       
def Ta_courses_info(request,id):
    if request.method =="GET":
        courses= Ta_info.objects.filter(id=id).first().course.values()
        return Response(courses)
        
@api_view(['GET'])
@csrf_exempt        
def Ta_courseRemove(request,taid,coursecode):
    ta = Ta_info.objects.filter(id = taid)

    if ta.exists() and ta.first().course.filter(courseCode=coursecode).exists():
        course = Courses.objects.filter(courseCode=coursecode)
        ta.first().course.remove(course.first()) 
        return Response("Deleted "+coursecode)
    return Response("Either TA or course don't exists")

@api_view(['POST'])
def Ta_courseAdd(request,taid):
    #it return id of student if student is valid otherwise -1

    ta = Ta_info.objects.filter(id = taid)

    if request.method=='POST':
        coursecode = request.data['coursecode']
        courseprivatecode = request.data['courseprivatecode']
        if ta.exists() and Courses.objects.filter(courseCode =coursecode,coursePrivateCode=courseprivatecode).exists():
            course = Courses.objects.filter(courseCode=coursecode)
            ta.first().course.add(*course) 
            ta.first().save()
            return Response(1)
    return Response(0)

@api_view(['GET'])
@csrf_exempt 
def Admin_data(request,id):
    if request.method =="GET":
        admin = Admin_info.objects.filter(id=id)
        if admin.exists():
            admin_serializer = Admin_infoSerializer(admin.first(), many=False)
            return Response(admin_serializer.data)
        else:
            return Response('No admin with these credentials')
        
@api_view(['POST'])
@csrf_exempt 
def Ta_register(request):
    ta_data = request.data
    if request.method == "POST":
        ta_name = ta_data["name"]
        ta_roll = ta_data["roll"]
        ta_pass = ta_data["password"]

        ta = Ta_info.objects.filter(Roll = ta_roll)  
        if ta.exists():
            return Response(0)
        ta = Ta_info.objects.create(
            Name=ta_name,
            Roll=ta_roll,
            Password=ta_pass
        )
        ta.save()
        return Response(1)
    Response(0)

@api_view(['POST'])
@csrf_exempt 
def Add_course(request):
    course_data = request.data
    if request.method == "POST":
        course_code = course_data["coursecode"]
        course_name = course_data["coursename"]
        course_privatecode = course_data["courseprivatecode"]
        course_professor = course_data["professor"]
        course_des = course_data["des"]
        course_credit = course_data["credit"]

        course = Courses.objects.filter(courseCode = course_code)  
        if course.exists():
            return Response(0)
        course = Courses.objects.create(
            courseCode = course_code,
            courseName = course_name,
            coursePrivateCode = course_privatecode,
            professor = course_professor,
            description = course_des,
            credits = course_credit
        )
        course.save()
        return Response(1)
    Response(0)
