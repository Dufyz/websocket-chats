"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useSignIn, useSignUp } from "@/hooks/auth.hook";
import { SignInSchema, SignUpSchema } from "@/schemas/auth.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}

export default function AuthModal({ open, setOpen, children }: AuthModalProps) {
  const { signedIn } = useAuth();
  const { form: signInForm, signIn } = useSignIn();
  const { form: signUpForm, signUp } = useSignUp();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const isInHomePage = pathname === "/";

  async function onSignIn(data: SignInSchema) {
    try {
      await signIn(data);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function onSignUp(data: SignUpSchema) {
    try {
      await signUp(data);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  function onClose() {
    if (isInHomePage) return;
    if (signedIn) return;

    navigate("/");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        onClose();
      }}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === "signin" ? "Bem-vindo de volta!" : "Crie sua conta"}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardDescription>
                  Entre com seu nome de usuário e senha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={signInForm.handleSubmit(onSignIn)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signin-name">Nome de usuário</Label>
                    <Input
                      id="signin-name"
                      {...signInForm.register("name")}
                      placeholder="Digite seu nome de usuário"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Senha</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      {...signInForm.register("password")}
                      placeholder="Digite sua senha"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardDescription>
                  Crie sua conta com um nome de usuário e senha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={signUpForm.handleSubmit(onSignUp)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome de usuário</Label>
                    <Input
                      id="signup-name"
                      {...signUpForm.register("name")}
                      placeholder="Escolha um nome de usuário"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      {...signUpForm.register("password")}
                      placeholder="Escolha uma senha"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Cadastrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
