from django.shortcuts import render, get_object_or_404, redirect
from .models import Funcionario
from .forms import FuncionarioForm

# Create your views here.


def listar_funcionarios(request):
    # Filtramos apenas os que não foram "excluídos" logicamente
    funcionarios = Funcionario.objects.filter(status='ATIVO')
    return render(request, 'funcionarios/lista.html', {'funcionarios': funcionarios})

def editar_funcionario(request, id):
    funcionario = get_object_or_404(Funcionario, id=id)
    if request.method == 'POST':
        form = FuncionarioForm(request.POST, instance=funcionario)
        if form.is_valid():
            form.save()
            return redirect('listar_funcionarios')
    else:
        form = FuncionarioForm(instance=funcionario)
    return render(request, 'funcionarios/editar.html', {'form': form, 'funcionario': funcionario})      

def deletar_funcionario(request, id):
    funcionario = get_object_or_404(Funcionario, id=id)
    # Aqui chamamos o método delete() que você sobrescreveu no models.py (Exclusão Lógica)
    funcionario.delete() 
    return redirect('listar_funcionarios')