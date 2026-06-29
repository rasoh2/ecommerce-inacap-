/*
  CyberShop - User Registration Lógica de Interfaz
  Desarrollado por el Senior Frontend Engineer (swe) - ai-team-dev
  Asistido por IA para validaciones dinámicas y peticiones AJAX.
*/

// Expresiones regulares de validación consistentes con el resto de la aplicación
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(?:\+?56)?9[0-9]{8}$/;

document.addEventListener('DOMContentLoaded', () => {
  setupRegisterValidation();
});

function setupRegisterValidation() {
  const form = document.getElementById('register-form');
  const nameInput = document.getElementById('register-name');
  const emailInput = document.getElementById('register-email');
  const phoneInput = document.getElementById('register-phone');
  const passwordInput = document.getElementById('register-password');
  const btnSubmit = document.getElementById('btn-submit-register');
  const alertError = document.getElementById('alert-error');

  const inputs = [nameInput, emailInput, phoneInput, passwordInput];

  // Escuchar entrada en los inputs para validaciones dinámicas en tiempo real
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      validateField(input);
      validateFormState();
    });
    input.addEventListener('blur', () => {
      validateField(input);
      validateFormState();
    });
  });

  // Validar un campo de entrada específico y aplicar clases Bootstrap
  function validateField(input) {
    let isValid = true;

    if (input.id === 'register-name') {
      const val = input.value.trim();
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
      isValid = nameRegex.test(val);
    } else if (input.id === 'register-email') {
      isValid = EMAIL_REGEX.test(input.value.trim());
    } else if (input.id === 'register-phone') {
      const val = input.value.trim().replace(/\s+/g, '');
      isValid = PHONE_REGEX.test(val);
    } else if (input.id === 'register-password') {
      isValid = input.value.length >= 6;
    }

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
    }

    return isValid;
  }

  // Comprobar si el formulario es completamente válido para habilitar/deshabilitar el botón
  function validateFormState() {
    const isNameValid = nameInput.value.trim().length >= 3 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameInput.value);
    const isEmailValid = EMAIL_REGEX.test(emailInput.value.trim());
    const isPhoneValid = PHONE_REGEX.test(phoneInput.value.trim().replace(/\s+/g, ''));
    const isPasswordValid = passwordInput.value.length >= 6;

    const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid;
    btnSubmit.disabled = !isFormValid;

    return isFormValid;
  }

  // Procesar submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateFormState()) return;

    // Deshabilitar botón inmediatamente para prevenir doble clic
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Procesando...';
    alertError.classList.add('d-none'); // Ocultar alerta de error previa

    const userData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      password: passwordInput.value
    };

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar la cuenta.');
      }

      // Registro exitoso: guardar estado e ir al index
      alert('¡Cuenta creada con éxito!');
      
      // Persistir el nombre de usuario registrado para bienvenida en el catálogo
      localStorage.setItem('user-registered-name', userData.name);
      
      window.location.href = 'index.html';

    } catch (error) {
      console.error('Error en registro:', error);
      
      // Mostrar contenedor de alerta y re-habilitar botón
      alertError.textContent = error.message;
      alertError.classList.remove('d-none');
      
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Crear cuenta';
    }
  });
}
