import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SkinPreferencesTab: React.FC = React.memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skin Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This section is under development. You'll soon be able to manage your skin type, concerns, and product
          preferences here.
        </p>
      </CardContent>
    </Card>
  );
});
