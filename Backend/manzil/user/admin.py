from django.contrib import admin

from .models import CustomUser,HouseownerProfile,Professions,ProfessionalsProfile

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(HouseownerProfile)
admin.site.register(Professions)
admin.site.register(ProfessionalsProfile)