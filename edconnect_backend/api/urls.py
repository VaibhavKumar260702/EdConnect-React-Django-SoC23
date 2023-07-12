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
        path("admin-data/<str:id>/",views.Admin_data,name="admin_data"),
        path("ta-register/",views.Ta_register,name="ta_register"),
        path("add-course/",views.Add_course,name="add_course"),
]