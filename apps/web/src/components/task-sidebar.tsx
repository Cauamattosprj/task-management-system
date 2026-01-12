import { Button } from "./ui/button";

export function TaskSidebar() {
  return (
    <div className="w-1/3 h-full border-l p-4">
      <div className="grid grid-cols-[120px_1fr] gap-y-2 items-center">
        <span className="text-muted-foreground">Status</span>
        <Button variant="ghost" className="w-full justify-start">
          Exemplo
        </Button>

        <span className="text-muted-foreground">Priority</span>
        <Button variant="ghost" className="w-full justify-start">
          Exemplo
        </Button>

        <span className="text-muted-foreground">Created By</span>
        <Button variant="ghost" className="w-full justify-start">
          Exemplo
        </Button>

        <span className="text-muted-foreground">Assignees</span>
        <Button variant="ghost" className="w-full justify-start">
          Exemplo
        </Button>

        <span className="text-muted-foreground">Deadline</span>
        <Button variant="ghost" className="w-full justify-start">
          Exemplo
        </Button>
      </div>
    </div>
  );
}
