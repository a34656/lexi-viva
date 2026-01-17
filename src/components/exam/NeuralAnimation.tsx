import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Node {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface Edge {
  id: number;
  from: number;
  to: number;
  delay: number;
}

export function NeuralAnimation({ className }: { className?: string }) {
  const [nodes] = useState<Node[]>(() => {
    const centerX = 120;
    const centerY = 120;
    const nodePositions: Node[] = [
      { id: 0, x: centerX, y: centerY, delay: 0 }, // Center
      { id: 1, x: centerX - 60, y: centerY - 50, delay: 0.5 },
      { id: 2, x: centerX + 60, y: centerY - 50, delay: 0.3 },
      { id: 3, x: centerX - 70, y: centerY + 40, delay: 0.7 },
      { id: 4, x: centerX + 70, y: centerY + 40, delay: 0.4 },
      { id: 5, x: centerX, y: centerY - 80, delay: 0.6 },
      { id: 6, x: centerX, y: centerY + 80, delay: 0.8 },
      { id: 7, x: centerX - 90, y: centerY, delay: 0.2 },
      { id: 8, x: centerX + 90, y: centerY, delay: 0.9 },
    ];
    return nodePositions;
  });

  const [edges] = useState<Edge[]>(() => [
    { id: 0, from: 0, to: 1, delay: 0 },
    { id: 1, from: 0, to: 2, delay: 0.1 },
    { id: 2, from: 0, to: 3, delay: 0.2 },
    { id: 3, from: 0, to: 4, delay: 0.3 },
    { id: 4, from: 0, to: 5, delay: 0.4 },
    { id: 5, from: 0, to: 6, delay: 0.5 },
    { id: 6, from: 1, to: 5, delay: 0.6 },
    { id: 7, from: 2, to: 5, delay: 0.7 },
    { id: 8, from: 3, to: 6, delay: 0.8 },
    { id: 9, from: 4, to: 6, delay: 0.9 },
    { id: 10, from: 1, to: 7, delay: 1.0 },
    { id: 11, from: 2, to: 8, delay: 1.1 },
    { id: 12, from: 7, to: 3, delay: 1.2 },
    { id: 13, from: 8, to: 4, delay: 1.3 },
  ]);

  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [activeEdges, setActiveEdges] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly activate/deactivate nodes
      const newActiveNodes = new Set<number>();
      nodes.forEach((node) => {
        if (Math.random() > 0.3) {
          newActiveNodes.add(node.id);
        }
      });
      setActiveNodes(newActiveNodes);

      // Activate edges between active nodes
      const newActiveEdges = new Set<number>();
      edges.forEach((edge) => {
        if (newActiveNodes.has(edge.from) && newActiveNodes.has(edge.to)) {
          newActiveEdges.add(edge.id);
        }
      });
      setActiveEdges(newActiveEdges);
    }, 800);

    return () => clearInterval(interval);
  }, [nodes, edges]);

  return (
    <div className={cn("relative w-60 h-60 mx-auto", className)}>
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 10px hsl(var(--primary) / 0.3))" }}
      >
        {/* Edges */}
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from)!;
          const toNode = nodes.find((n) => n.id === edge.to)!;
          const isActive = activeEdges.has(edge.id);
          
          return (
            <line
              key={edge.id}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--graph-edge))"}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 0.8 : 0.3}
              className="transition-all duration-500"
              style={{
                strokeDasharray: isActive ? "none" : "4 4",
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = activeNodes.has(node.id);
          const isCenter = node.id === 0;
          
          return (
            <g key={node.id}>
              {/* Glow effect */}
              {isActive && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCenter ? 16 : 10}
                  fill="none"
                  stroke={isCenter ? "hsl(var(--accent))" : "hsl(var(--primary))"}
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  className="animate-node-glow"
                />
              )}
              
              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isCenter ? 12 : 6}
                fill={isActive 
                  ? isCenter 
                    ? "hsl(var(--accent))" 
                    : "hsl(var(--primary))"
                  : "hsl(var(--muted))"
                }
                className="transition-all duration-300"
              />
              
              {/* Inner dot for center */}
              {isCenter && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={4}
                  fill="hsl(var(--background))"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/10 via-transparent to-transparent animate-pulse pointer-events-none" />
    </div>
  );
}
