from django.shortcuts import render
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import Admin_infoSerializer,Ta_infoSerializer,Student_infoSerializer
from .models import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from datetime import datetime,date,timedelta
from django.utils import timezone

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
        courses = []
        ta_list = Student_info.objects.filter(id=id).first().ta.values()
        for ta in ta_list:
            ta_id = ta['id']
            course_info = Ta_info.objects.filter(id=ta_id).first().course.values().first()
            courses.append(course_info)
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


@api_view(['POST'])
def Student_courseAdd(request,studentid):
    #it return id of student if student is valid otherwise -1

    s = Student_info.objects.filter(id = studentid)

    if request.method=='POST':
        privatecode = request.data['privatecode'] #private code to join some TA tutorial
        if s.exists() and Ta_info.objects.filter(privatecode=privatecode).exists():
            ta = Ta_info.objects.filter(privatecode=privatecode)
            s.first().ta.add(*ta) 
            s.first().save()
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


@api_view(['POST'])
@csrf_exempt 
def Get_attendance(request):
    data = request.data
    if request.method == 'POST':
        student_roll = data['roll']
        coursecode = data['coursecode']
        all_attendance_records = Attendance_Records.objects.filter(Roll=student_roll).values()
        session_ids = [d.get('Session_id') for d in all_attendance_records]
        attendance_records = Attendance_sessions.objects.filter(id__in=session_ids,CourseCode = coursecode).values()
        attendance_dates = [str(d.get('Date')) for d in attendance_records]
        converted_dates=[]
        for date_str in attendance_dates:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            formatted_date = date_obj.strftime('%b-%d-%Y')
            converted_dates.append(formatted_date)
        return Response(converted_dates)
    

@api_view(['POST'])
@csrf_exempt 
def Check_session(request): #this is for student 
    #if session is present within 5 min of range then return true or may be session id;
    data=request.data
    if request.method == 'POST':
        student_roll = data['roll']
        coursecode = data['coursecode']
        all_tas = Student_info.objects.filter(Roll=student_roll).first().ta.values()
        all_tas_ids = [d.get('id') for d in all_tas]
        for ta_id in all_tas_ids:
            ta_course_info = Ta_info.objects.filter(id=ta_id).first().course.values()[0]
            if ta_course_info['courseCode'] == coursecode: # this is the ta
                #check if some session is there or not by this ta within 5 min of time
                current_time = timezone.localtime(timezone.now())
                target_time = current_time - timedelta(minutes=5)
                session = Attendance_sessions.objects.filter(Ta__id = ta_id,CourseCode = coursecode,Date = date.today(),Start__gte=target_time)
                if session.exists():
                    return Response(session.first().id)
        return Response(-1)

@api_view(['POST'])
@csrf_exempt 
def Mark_attendance(request):
    data = request.data
    if request.method == 'POST':
        student_roll = data['roll']
        session_id = data['sessionid']
        instance = Attendance_Records.objects.create(
            Session = Attendance_sessions.objects.filter(id = session_id).first(),
            Roll = student_roll,
            Attend_time = timezone.localtime(timezone.now()).replace(microsecond=0).time()
        )
        instance.save()
        return Response(1)
    return Response(0)

        
@api_view(['POST'])
@csrf_exempt 
def Start_attendance(request):
    data = request.data
    course_code = data['coursecode']
    ta_id = data['taid']    
    ta = Ta_info.objects.filter(id = ta_id).first()
    if request.method == 'POST':
        instance = Attendance_sessions.objects.create(
            CourseCode = course_code,
            Ta = ta,
            Start = timezone.localtime(timezone.now()).replace(microsecond=0).time()
        )
        instance.save()
        return Response(instance.id) # 1 means new session is started
    return Response(-1)


@api_view(['POST'])
@csrf_exempt 
def Check_ta_session(request): #this is for student 
    data = request.data
    course_code = data['coursecode']
    ta_id = data['taid']    
    ta = Ta_info.objects.filter(id = ta_id).first()
    current_time = timezone.localtime(timezone.now())
    target_time = current_time - timedelta(minutes=5)
    session = Attendance_sessions.objects.filter(CourseCode=course_code,Ta = ta,Date = date.today(),Start__gte=target_time)
    if session.exists():
        return Response(session.first().id)
    return Response(-1)

@api_view(['POST'])
@csrf_exempt 
def Get_attendance_list(request): #this is for student 
    data=request.data
    course_code = data['coursecode']
    ta_id = data['taid']
    _date = data['date']
    ta = Ta_info.objects.filter(id = ta_id).first()
    session = Attendance_sessions.objects.filter(CourseCode=course_code,Ta=ta,Date=_date)
    if session.exists():
        Attendance_records = Attendance_Records.objects.filter(Session=session.first()).values()
        Attendance_list = []
        for obj in Attendance_records:
           new_obj = {"name":Student_info.objects.filter(Roll=obj['Roll']).first().Name,"roll":obj['Roll'],"time":obj['Attend_time']}
           Attendance_list.append(new_obj)
        return Response(Attendance_list)
    
    return Response([])


@api_view(['POST'])
@csrf_exempt 
def Get_announcement_list(request): #this is for student 
    data=request.data
    ta_id = data['taid']
    course_code = data['coursecode']
    ta = Ta_info.objects.filter(id=ta_id).first()
    announcements = Announcements.objects.filter(Ta = ta, CourseCode=course_code).order_by('-Date', '-Time').values('id','title', 'description', 'Date', 'Time')
    for announcement in announcements:
        announcement['Time'] = announcement['Time'].strftime('%H:%M:%S')  
    
    return Response(announcements)

@api_view(['POST'])
@csrf_exempt 
def Make_announcement(request):
    data = request.data
    course_code = data['coursecode']
    ta_id = data['taid']    
    title = data['title']
    description = data['description']
    ta = Ta_info.objects.filter(id = ta_id).first()
    if request.method == 'POST':
        instance = Announcements.objects.create(
            CourseCode = course_code,
            Ta = ta,
            title=title,
            description=description

        )
        instance.save()
        return Response(1)
    Response(0)

@api_view(['POST'])
@csrf_exempt
def Get_ta_info(request):
    data=request.data
    student_id = data['studentid']
    course_code = data['coursecode']
    student = Student_info.objects.filter(id=student_id).first()
    course = Courses.objects.filter(courseCode = course_code).first()
    if request.method == 'POST': 
        return Response(student.ta.filter(course=course).values('id','Name','Roll')[0])
    

@api_view(['POST'])
@csrf_exempt
def Get_ta_list(request):
    data=request.data
    course_code = data['coursecode']
    course = Courses.objects.filter(courseCode = course_code).first()
    ta_list = Ta_info.objects.filter(course = course).values('id','Name','Roll')
    return Response(ta_list)

@api_view(['POST'])
@csrf_exempt
def Get_student_list(request):
    data=request.data
    ta_id = data['taid']
    ta = Ta_info.objects.filter(id=ta_id).first()
    students_list = Student_info.objects.filter(ta=ta).values('id','Name','Roll')
    return Response(students_list)

@api_view(['POST'])
@csrf_exempt
def Get_discussion_list(request):
    data = request.data
    ta_id = data['taid']
    course_code = data['coursecode']
    if request.method == 'POST':
        discussions_by_ta = Discussion.objects.filter(CourseCode=course_code, User_type__model='ta_info', User_id=ta_id)
        discussions_related_to_ta = Discussion.objects.filter(CourseCode=course_code, User_type__model='student_info', User_id__in=Ta_info.objects.get(id=ta_id).student_info_set.values_list('id', flat=True))
        desired_discussions = (discussions_by_ta | discussions_related_to_ta).order_by('-Date', '-Time')
        desired_discussions_with_user_info = []
        for discussion in desired_discussions:
            if discussion.User_type.model == 'ta_info':
                user = Ta_info.objects.get(id=discussion.User_id)
                user_type = 'TA'
            else:
                user = Student_info.objects.get(id=discussion.User_id)
                user_type = 'Student'

            user_info = {
                'id':discussion.id,
                'CourseCode': discussion.CourseCode,
                'Date': discussion.Date,
                'Time': discussion.Time.strftime('%H:%M:%S'),
                'title': discussion.title,
                'description': discussion.description,
                'Name': user.Name,
                'Roll': user.Roll,
                'User_type': user_type,
                'discussion_type':discussion.Discussion_type
            }
            desired_discussions_with_user_info.append(user_info)
        return Response(desired_discussions_with_user_info)

@api_view(['GET'])
def Get_discussionfollowups_list(request,id):
    followup_discussions = Discussion_followup.objects.filter(ParentDiscussionId=id).order_by('-Date', '-Time')
    followup_discussions_with_user_info = []
    for discussion in followup_discussions:
        if discussion.User_type.model == 'ta_info':
            user = Ta_info.objects.get(id=discussion.User_id)                
            user_type = 'TA'
        else:
            user = Student_info.objects.get(id=discussion.User_id)
            user_type = 'Student'

        user_info = {
            'id':discussion.id,
            'Date': discussion.Date,
            'Time': discussion.Time.strftime('%H:%M:%S'),
            'description': discussion.description,
            'Name': user.Name,
            'Roll': user.Roll,
            'User_type':user_type
        }
        followup_discussions_with_user_info.append(user_info)
    return Response(followup_discussions_with_user_info)

@api_view(['POST'])
def Add_discussion(request):
    data = request.data
    if request.method == 'POST':
        course_code = data['coursecode']
        user_id = data['id'] 
        if data['usertype']==1:
            user_instance = Ta_info.objects.get(id=user_id)
        else:
            user_instance = Student_info.objects.get(id=user_id)
        user_type = ContentType.objects.get_for_model(user_instance)
        discussion_type = Discussion.GENERAL if data['discussiontype']=='0' else Discussion.DOUBTS 
        title = data['title']
        description = data['description']

        new_discussion = Discussion(
            CourseCode=course_code,
            User_type=user_type,
            User_id=user_id,
            Discussion_type=discussion_type,
            title=title,
            description=description,
        )
        new_discussion.save()
    return Response(1)

@api_view(['POST'])
def Add_followup(request):
    data=request.data
    print(data)
    if request.method == 'POST':
        user_id = data['userid'] 
        post_id = data['postid'] 
        if data['usertype']==1:
            user_instance = Ta_info.objects.get(id=user_id)
        else:
            user_instance = Student_info.objects.get(id=user_id)
        user_type = ContentType.objects.get_for_model(user_instance)
        description = data['description']
        new_followup = Discussion_followup(
            ParentDiscussionId = Discussion.objects.get(id=post_id),
            User_type=user_type,
            User_id=user_id,
            description=description,
        )
        new_followup.save()
    return Response(1)

@api_view(['POST'])
def Get_filtered_discussion_list(request):
    data = request.data
    course_code = data['course_code']
    discussion_user_type = int(data['discussion_user_type']) #like everyone,mine,students,TA
    logged_user_type = data['logged_user_type'] # TA or Student 
    user_id = int(data['id']) # id of logged user
    post_type = int(data['post_type']) #like all,general,doubts
    page_number = int(data['page_number'])
    posts_per_page = 30
    offset = (page_number - 1) * posts_per_page
    try:
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date() 
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date() 
    except:
        return Response([[],0])
    filtered_list = []
    L = 0
    if request.method == 'POST':
        if logged_user_type == "TA" and discussion_user_type==1: # TA wants his posts
            if post_type == 0: #all the posts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='ta_info', User_id=user_id,Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            elif post_type == 1: # general
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='ta_info', User_id=user_id,Discussion_type="General",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            else: #doubts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='ta_info', User_id=user_id,Discussion_type="Doubts",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
        elif logged_user_type == "Student" and discussion_user_type == 1 : #Student wants his posts
            if post_type == 0: #all the posts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='student_info', User_id=user_id,Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            elif post_type == 1: # general
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='student_info', User_id=user_id,Discussion_type="General",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            else: #doubts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='student_info', User_id=user_id,Discussion_type="Doubts",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
        elif discussion_user_type==0 : # everyone's post 
            if post_type == 0: #all the posts
                filtered_list = Discussion.objects.filter(CourseCode=course_code,Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            elif post_type == 1: # general
                filtered_list = Discussion.objects.filter(CourseCode=course_code,Discussion_type="General",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            else: #doubts
                filtered_list = Discussion.objects.filter(CourseCode=course_code,Discussion_type="Doubts",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
        elif discussion_user_type==2 : # students post
            if post_type == 0: #all the posts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='student_info',Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            elif post_type == 1: # general
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='student_info',Discussion_type="General",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            else: #doubts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='student_info',Discussion_type="Doubts",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
        elif discussion_user_type==3 : # TA's post
            if post_type == 0: #all the posts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='ta_info',Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            elif post_type == 1: # general
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='ta_info',Discussion_type="General",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
            else: #doubts
                filtered_list = Discussion.objects.filter(CourseCode=course_code, User_type__model='ta_info',Discussion_type="Doubts",Date__range=(start_date, end_date)).order_by('-Date', '-Time')
        L = filtered_list.count()
        filtered_list = filtered_list[offset:offset + posts_per_page]
        desired_discussions_with_user_info = []
        for discussion in filtered_list:
            if discussion.User_type.model == 'ta_info':
                user = Ta_info.objects.get(id=discussion.User_id)
                user_type = 'TA'
            else:
                user = Student_info.objects.get(id=discussion.User_id)
                user_type = 'Student'

            user_info = {
                'id':discussion.id,
                'CourseCode': discussion.CourseCode,
                'Date': discussion.Date,
                'Time': discussion.Time.strftime('%H:%M:%S'),
                'title': discussion.title,
                'description': discussion.description,
                'Name': user.Name,
                'Roll': user.Roll,
                'User_type': user_type,
                'discussion_type':discussion.Discussion_type
            }
            desired_discussions_with_user_info.append(user_info)
        return Response([desired_discussions_with_user_info,L])
    

@api_view(['POST'])
def Edit_discussion(request):
    data = request.data
    discussion_id = int(data['id'])
    title = data['title']
    description = data['description']

    if request.method == 'POST':
        discussion = Discussion.objects.get(id=discussion_id)
        discussion.title = title
        discussion.description = description
        discussion.save()
        return Response(1)
    
    return Response(0)
    