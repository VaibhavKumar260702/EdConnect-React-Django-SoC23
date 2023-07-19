from django.urls import path
from . import views

urlpatterns = [
        path("student-login/",views.Student_login,name="student_login"),
        path("admin-login/",views.Admin_login,name="admin_login" ),
        path("ta-login/",views.Ta_login,name="ta_login"),  
        path("student-register/",views.Student_register,name="student_register"),
        path("student-data/<str:id>/",views.Student_data,name="student_data"),
        path("student-courses-info/<str:id>/",views.Student_courses_info,name="student_courses_info"),
        path("ta-data/<str:id>/",views.Ta_data,name="ta_data"),
        path("ta-courses-info/<str:id>/",views.Ta_courses_info,name="ta_courses_info"),
        path("ta-course-remove/<str:taid>/<str:coursecode>/",views.Ta_courseRemove,name="ta_course_delete"),
        path("ta-course-add/<str:taid>/",views.Ta_courseAdd,name="ta_course_add"),
        path("student-course-add/<str:studentid>/",views.Student_courseAdd,name="student_course_add"),
        path("admin-data/<str:id>/",views.Admin_data,name="admin_data"),
        path("ta-register/",views.Ta_register,name="ta_register"),
        path("add-course/",views.Add_course,name="add_course"),
        path("get-attendance/",views.Get_attendance,name="get_attendance"),
        path("check-session/",views.Check_session,name="check_session"),
        path("mark-attendance/",views.Mark_attendance,name="mark_attendance"),
        path("start-attendance/",views.Start_attendance,name="start_attendance"),
        path("check-ta-session/",views.Check_ta_session,name="check_ta_session"),
        path("get-attendance-list/",views.Get_attendance_list,name="get_attendance_list"),
        
]