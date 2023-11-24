from django.contrib import admin

from .models import CustomUser,HouseownerProfile,Professions,ProfessionalsProfile,Plan,UserPlan

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(HouseownerProfile)
admin.site.register(Professions)
admin.site.register(ProfessionalsProfile)
admin.site.register(Plan)
admin.site.register(UserPlan)