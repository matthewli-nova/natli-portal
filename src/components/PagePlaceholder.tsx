import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

export function PagePlaceholder({ message }: { message?: string }) {
  return (
    <div className="mx-auto max-w-6xl">
      <Card className="p-8 text-center border-0 bg-transparent shadow-none">
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            {message ?? 'This page is currently under construction.'}
          </p>
          {message && (
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
