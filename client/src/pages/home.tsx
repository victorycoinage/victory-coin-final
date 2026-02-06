import { TodoInput } from "@/components/todo-input";
import { TodoList } from "@/components/todo-list";
import { motion } from "framer-motion";

export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-primary mb-2 font-display">
            Focus
          </h1>
          <p className="text-muted-foreground font-light text-lg">{today}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <TodoInput />
          <TodoList />
        </motion.div>
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-auto pt-12 text-center text-sm text-muted-foreground/40 font-light"
      >
        <p>Simple, minimal task management.</p>
      </motion.footer>
    </div>
  );
}
