import React, { useEffect, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from '@/hooks/use-theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { GitHubFileContent } from '@shared/types';
interface FileViewerProps {
  file: GitHubFileContent;
}
export function FileViewer({ file }: FileViewerProps) {
  const { isDark } = useTheme();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    if (file && file.content && file.encoding === 'base64') {
      try {
        const decodedContent = atob(file.content);
        setContent(decodedContent);
      } catch (e) {
        console.error("Failed to decode base64 content", e);
        setContent("Error: Could not decode file content.");
      }
    } else {
      setContent("Cannot display binary file or content is unavailable.");
    }
    setIsLoading(false);
  }, [file]);
  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (!content) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{file.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load file content.</p>
        </CardContent>
      </Card>
    );
  }
  const language = file.name.split('.').pop() || 'plaintext';
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{file.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <Highlight
          theme={isDark ? themes.vsDark : themes.vsLight}
          code={content}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} p-4 rounded-md overflow-auto text-sm bg-secondary`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-10 text-right pr-4 text-muted-foreground select-none">{i + 1}</span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </CardContent>
    </Card>
  );
}