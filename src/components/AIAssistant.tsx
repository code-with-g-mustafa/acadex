"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QAChat } from "@/components/QAChat";
import type { Resource } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, FileText } from "lucide-react";

type AIAssistantProps = {
  resource: Resource;
};

export function AIAssistant({ resource }: AIAssistantProps) {
  const shortNotesList = resource.shortNotes.split('\n').filter(note => note.trim() !== '');

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bot className="w-6 h-6 text-primary" />
          <span>AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">
              <FileText className="w-4 h-4 mr-2"/>
              Summary
            </TabsTrigger>
            <TabsTrigger value="qa">
              <Bot className="w-4 h-4 mr-2"/>
              Q&A
            </TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <ScrollArea className="h-[400px] p-1">
                <div className="space-y-4 text-sm mt-2 pr-4">
                    <h3 className="font-semibold font-headline">Summary</h3>
                    <p className="text-muted-foreground">{resource.summary}</p>
                    <h3 className="font-semibold font-headline">Short Notes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        {shortNotesList.map((note, index) => (
                            <li key={index}>{note}</li>
                        ))}
                    </ul>
                </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="qa">
            <QAChat documentContent={resource.content} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
