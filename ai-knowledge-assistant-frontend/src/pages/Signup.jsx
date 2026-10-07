import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import FormField from '../components/auth/FormField';
import FormAlert from '../components/auth/FormAlert';
import PasswordStrength from '../components/auth/PasswordStrength';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { EMAIL_PATTERN } from '../components/auth/validation';

const validate = ({ fullName, email, password, confirm }) => {
  const errors = {};
  if (!fullName.trim()) errors.fullName = 'Please tell us what to call you.';
  else if (fullName.trim().length > 80) errors.fullName = 'Please keep your name under 80 characters.';
  if (!email.trim()) errors.email = 'Please enter your email.';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "That doesn't look like a valid email.";
  if (password.length < 8) errors.password = 'Use at least 8 characters.';
  else if (password.length > 72) errors.password = 'Please keep it under 72 characters.';
  if (!confirm) errors.confirm = 'Please confirm your password.';
  else if (confirm !== password) errors.confirm = "Those passwords don't match yet.";
  return errors;
};

export default function Signup() {
  const { signUp } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
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
      const user = await signUp(form.fullName, form.email, form.password);
      notify(`Welcome aboard, ${user.fullName.split(' ')[0]}! Your account is ready.`, 'success');
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8 space-y-2">
        <h2 className="font-display text-[32px] font-medium leading-tight tracking-tight text-ink">Create your account</h2>
        <p className="text-[15px] text-ink-soft">It takes less than a minute. Let's get you set up.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormAlert message={serverError} />

        <FormField
          id="fullName"
          label="Your name"
          icon={User}
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={form.fullName}
          onChange={update('fullName')}
          error={errors.fullName}
          autoFocus
        />

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
        />

        <div>
          <FormField
            id="password"
            label="Password"
            type="password"
            icon={Lock}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
          />
          <PasswordStrength password={form.password} />
        </div>

        <FormField
          id="confirm"
          label="Confirm password"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          placeholder="Type it once more"
          value={form.confirm}
          onChange={update('confirm')}
          error={errors.confirm}
        />

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-[15px]">
          {loading ? (
            <>
              <Spinner /> Creating your account…
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-accent underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
