import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormField from '../components/auth/FormField';
import FormAlert from '../components/auth/FormAlert';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EMAIL_PATTERN } from '../components/auth/validation';

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Please enter your email.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "That doesn't look like a valid email.";
  if (!password) errors.password = 'Please enter your password.';
  return errors;
};

export default function Login() {
  const { signIn } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    setServerError('');
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const user = await signIn(form.email, form.password);
      notify(`Welcome back, ${user.fullName.split(' ')[0]}!`, 'success');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 space-y-2">
        <h2 className="font-display text-[32px] font-medium leading-tight tracking-tight text-ink">Welcome back</h2>
        <p className="text-[15px] text-ink-soft">Sign in to pick up right where you left off.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert message={serverError} />

        <FormField
          id="email"
          label="Email"
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          autoFocus
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
        />

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-[15px]">
          {loading ? (
            <>
              <Spinner /> Signing you in…
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        New to Lumen?{' '}
        <Link to="/signup" className="font-semibold text-accent underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
