from django.shortcuts import render, redirect
from .forms import PhotoForm

def upload_photo(request):
    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('/users/profiles/')  # Redirect to a profiles
    else:
        form = PhotoForm()
    return render(request, 'profile_picture/upload_photo.html', {'form': form})
