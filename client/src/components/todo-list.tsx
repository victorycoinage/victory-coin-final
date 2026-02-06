import { useTodos, useToggleTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TodoList() {
  const { data: todos, isLoading } = useTodos();
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!todos?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <p className="text-muted-foreground font-light text-lg">No tasks yet. Enjoy your day!</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-8">
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-border/40 
                       hover:border-border hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => toggleTodo.mutate({ id: todo.id, completed: !todo.completed })}
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${todo.completed 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground/30 hover:border-primary/50'}
                `}
              >
                {todo.completed && <Check className="w-3.5 h-3.5" />}
              </button>
              <span className={`
                text-lg font-light transition-all duration-300 select-none
                ${todo.completed ? 'text-muted-foreground line-through decoration-border' : 'text-foreground'}
              `}>
                {todo.text}
              </span>
            </div>
            
            <button
              onClick={() => deleteTodo.mutate(todo.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive 
                         hover:bg-destructive/5 rounded-lg transition-all duration-200"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
