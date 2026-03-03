import { Card, CardContent } from "./ui/card";

export function PagePlaceholder() {
  return (
    <div className="mx-auto max-w-6xl">
      <Card className="p-8 text-center border-0 bg-transparent shadow-none">
        <CardContent>
          <p className="text-muted-foreground">
            This page is currently under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
