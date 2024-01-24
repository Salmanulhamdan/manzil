from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser,HouseownerProfile,ProfessionalsProfile



@receiver(post_save, sender=CustomUser)
def create_profile(sender,instance,created, **kwargs):
 
    if created:
        if instance.usertype=='houseowner':
    
            HouseownerProfile.objects.create(user=instance)
        
        else:
           
            ProfessionalsProfile.objects.create(user=instance)


@receiver(post_save, sender=CustomUser)
def save_profile(sender,instance, **kwargs):
    print("save signals")
    if instance.usertype=='houseowner':
        instance.houseowner_profile.save()
    else:
        instance.professional_profile.save()