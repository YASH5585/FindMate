import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { ReportFormField } from '@/components/report/ReportFormField';
import { Spinner } from '@/components/ui/Spinner';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (password !== confirm) {
      return;
    }
    try {
      await register(name, email, password);
      navigate('/browse');
    } catch {
      // error surfaced via auth context
    }
  };

  return (
    <div className="w-full py-12 md:py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <Heading level={1} size="h2" className="mb-2">
              Create your account
            </Heading>
            <Text color="muted">
              Join FindMate to report and track lost and found items.
            </Text>
          </div>

          {error && (
            <Text color="muted" className="mb-4 text-sm" role="alert">
              {error}
            </Text>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <ReportFormField label="Full Name" htmlFor="register-name" required error={undefined}>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 rounded-card border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </ReportFormField>

            <ReportFormField label="Email" htmlFor="register-email" required error={undefined}>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-card border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </ReportFormField>

            <ReportFormField label="Password" htmlFor="register-password" required error={undefined}>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-card border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </ReportFormField>

            <ReportFormField label="Confirm Password" htmlFor="register-confirm" required error={undefined}>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full h-12 px-4 rounded-card border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </ReportFormField>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading || password !== confirm}>
              {loading ? <Spinner /> : 'Create Account'}
            </Button>
          </form>

          <Text color="muted" size="sm" className="mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-brand hover:underline font-medium">
              Sign in
            </Link>
          </Text>
        </div>
      </Container>
    </div>
  );
};
