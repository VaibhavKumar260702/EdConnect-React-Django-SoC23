from django.contrib import admin
from .models import Admin_info,Ta_info,Student_info,Courses
# Register your models here.

admin.site.register(Admin_info)
admin.site.register(Ta_info)
admin.site.register(Student_info)
admin.site.register(Courses)
