
import React, { useState } from 'react';
import { Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface HeaderProps {
  className?: string;
}

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    // This would be replaced with actual authentication logic
    setTimeout(() => {
      setIsSignedIn(true);
      setIsOpen(false);
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${values.email}`,
      });
    }, 1000);
  };
  
  const handleSignOut = () => {
    setIsSignedIn(false);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };
  
  const onForgotPasswordSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    // This would be replaced with actual password reset logic
    setIsForgotPasswordOpen(false);
    toast({
      title: "Password reset link sent",
      description: `Check your email at ${values.email} for password reset instructions`,
    });
  };
  
  return (
    <header className={`w-full py-4 md:py-6 px-4 flex items-center justify-between animate-slide-down ${className}`}>
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center shadow-sm">
          <Globe className="h-6 w-6 text-white" />
        </div>
        <div className="font-display">
          <h1 className="text-xl font-bold tracking-tight">LinguistConnect</h1>
          <p className="text-xs text-muted-foreground">AI-Powered Translation</p>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="text-sm font-medium hover:text-brand-600 transition-colors">Translate</a>
        <a href="#" className="text-sm font-medium hover:text-brand-600 transition-colors">Documents</a>
        <a href="#" className="text-sm font-medium hover:text-brand-600 transition-colors">About</a>
      </nav>
      
      <div className="flex items-center gap-2">
        {isSignedIn ? (
          <Button 
            onClick={handleSignOut}
            className="button-animation px-4 py-2 rounded-lg bg-brand-50 text-brand-700 font-medium text-sm"
          >
            Sign Out
          </Button>
        ) : (
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button 
                className="button-animation px-4 py-2 rounded-lg bg-brand-50 text-brand-700 font-medium text-sm"
              >
                Sign In
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Sign In</DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="px-0 h-auto text-xs text-brand-600"
                        onClick={() => {
                          setIsForgotPasswordOpen(true);
                          forgotPasswordForm.reset();
                        }}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                  </form>
                </Form>
              </div>
              <DrawerFooter>
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account? <a href="#" className="text-brand-600 hover:underline">Sign Up</a>
                </p>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
          </DialogHeader>
          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Enter your email" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsForgotPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Send reset link
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
