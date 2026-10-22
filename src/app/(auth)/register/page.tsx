'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  Trophy,
  Shield,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/features/auth/auth.types';
import { useRegister } from '@/features/auth/auth.hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { env } from '@/lib/env';

const POSITIONS = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
const FEET = ['Right', 'Left', 'Both'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Semi-Pro'];
const DHAKA_AREAS = ['Dhanmondi', 'Gulshan', 'Uttara', 'Banani', 'Mirpur', 'Bashundhara', 'Mohammadpur', 'Badda'];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'NORMAL',
      isPlayerProfile: false,
      position: 'Forward',
      preferredFoot: 'Right',
      city: 'Dhaka',
      area: 'Dhanmondi',
      skillLevel: 'Intermediate',
    },
  });

  const isPlayerProfile = watch('isPlayerProfile');

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  const handleGoogleSignup = () => {
    window.location.href = `${env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg border-border/60 shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center pb-2">
            <Badge variant="secondary" className="gap-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <UserPlus className="h-3.5 w-3.5" />
              Join TurfXI
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Book turfs across Bangladesh, split bills with teammates, and join tournaments
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 text-sm font-medium"
            onClick={handleGoogleSignup}
            disabled={isPending}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign up with Google
          </Button>

          <div className="relative flex items-center justify-center">
            <Separator className="w-full" />
            <span className="absolute bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
              or fill registration details
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Tanvir Ahmed"
                disabled={isPending}
                className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <Label htmlFor="reg-email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="tanvir@example.com"
                autoComplete="email"
                disabled={isPending}
                className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <Label htmlFor="reg-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  disabled={isPending}
                  className={`pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Player Profile Unlock Toggle */}
            <div className="rounded-lg border border-border/80 bg-secondary/30 p-3.5 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-semibold text-foreground">
                      Unlock Player Role
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enables Player Profile, Missing Players network, stats, and tournament rosters
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="player-toggle"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  checked={isPlayerProfile}
                  onChange={(e) => setValue('isPlayerProfile', e.target.checked)}
                />
              </div>

              {isPlayerProfile && (
                <div className="mt-4 space-y-3 border-t border-border/60 pt-3 text-left">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="position" className="text-xs font-medium text-foreground">
                        Position
                      </Label>
                      <select
                        id="position"
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...register('position')}
                      >
                        {POSITIONS.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="preferredFoot" className="text-xs font-medium text-foreground">
                        Preferred Foot
                      </Label>
                      <select
                        id="preferredFoot"
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...register('preferredFoot')}
                      >
                        {FEET.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="area" className="text-xs font-medium text-foreground">
                        Area / Neighborhood (Dhaka)
                      </Label>
                      <select
                        id="area"
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...register('area')}
                      >
                        {DHAKA_AREAS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="skillLevel" className="text-xs font-medium text-foreground">
                        Skill Level
                      </Label>
                      <select
                        id="skillLevel"
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        {...register('skillLevel')}
                      >
                        {SKILL_LEVELS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Type Note */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Includes automatic in-app wallet creation for split-billing</span>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t border-border/40 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-emerald-600"
            >
              Sign in
            </Link>
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="h-3 w-3" />
            Want to list your turf venue? Register and request Turf Owner status from settings.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
