import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Typography';
import { Text } from '@/components/ui/Typography';
import { ReportFormField } from '@/components/report/ReportFormField';
import { Spinner } from '@/components/ui/Spinner';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      navigate('/browse');
    } catch {
      // error is surfaced via the auth context
    }
  };

  return (
    <div className="w-full py-12 md:py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="mb-8 text-center">
            <Heading level={1} size="h2" className="mb-2">
              Welcome back
            </Heading>
            <Text color="muted">
              Sign in to report and browse lost and found items.
            </Text>
          </div>

          {error && (
            <Text size="sm" role="alert" className="mb-4 text-brand font-medium">
              {error}
            </Text>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <ReportFormField label="Email" htmlFor="login-email" required error={undefined}>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-card border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </ReportFormField>

            <ReportFormField label="Password" htmlFor="login-password" required error={undefined}>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 rounded-card border border-black/10 bg-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </ReportFormField>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : 'Sign In'}
            </Button>
          </form>

          <Text color="muted" size="sm" className="mt-6 text-center">
            New to FindMate?{' '}
            <Link to="/register" className="text-brand hover:underline font-medium">
              Create an account
            </Link>
          </Text>
        </div>
      </Container>
    </div>
  );
};
