import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { categories } from "@/data/categories.data";
import { useCreateChat } from "@/pages/chat/hooks/chat-actions.hook";
import { Controller } from "react-hook-form";
import { CreateChatSchema } from "@/pages/chat/schemas/chat.schema";
import { useAuth } from "@/hooks/auth.hook";

export default function CreateChatModal() {
  const { signedIn } = useAuth();
  const { createChat, form } = useCreateChat();

  const [open, setOpen] = useState(false);

  function onSubmit(data: CreateChatSchema) {
    createChat(data);
    setOpen(false);
  }

  if (!signedIn) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <p>Criar sala</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="font-bold">
            Criar uma nova sala de bate-papo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da sala</Label>
            <Input
              {...form.register("name")}
              className="bg-gray-800 border-gray-700"
              placeholder="Digite o nome da sala"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger
                    className="bg-gray-800 border-gray-700"
                    tabIndex={0}
                  >
                    {categories.find((c) => c.value === field.value)?.label ||
                      "Selecione uma categoria"}
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        value={category.value}
                        onClick={() => field.onChange(category.value)}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <p>Criar sala</p>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
