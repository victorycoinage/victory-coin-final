import { useState } from "react";
import { useCreateTodo } from "@/hooks/use-todos";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export function TodoInput() {
  const [text, setText] = useState("");
  const createTodo = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    createTodo.mutate(
      { text, completed: false },
      { onSuccess: () => setText("") }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Plus className={`w-5 h-5 transition-colors duration-300 ${text ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-transparent 
                   focus:border-border focus:ring-0 focus:shadow-md transition-all duration-300
                   placeholder:text-muted-foreground/60 text-lg font-light tracking-wide"
        disabled={createTodo.isPending}
      />
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: text.trim() ? 1 : 0, scale: text.trim() ? 1 : 0.9 }}
        disabled={!text.trim() || createTodo.isPending}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground 
                   px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Add
      </motion.button>
    </form>
  );
}
