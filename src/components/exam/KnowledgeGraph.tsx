import { cn } from "@/lib/utils";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  active?: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface KnowledgeGraphProps {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  activeNodeId?: string;
  className?: string;
}

const defaultNodes: GraphNode[] = [
  { id: "1", label: "Main Thesis", x: 100, y: 60, active: true },
  { id: "2", label: "Methodology", x: 50, y: 120 },
  { id: "3", label: "Results", x: 150, y: 120 },
  { id: "4", label: "Analysis", x: 70, y: 180 },
  { id: "5", label: "Conclusion", x: 130, y: 180 },
];

const defaultEdges: GraphEdge[] = [
  { from: "1", to: "2" },
  { from: "1", to: "3" },
  { from: "2", to: "4" },
  { from: "3", to: "5" },
  { from: "4", to: "5" },
];

export function KnowledgeGraph({ 
  nodes = defaultNodes, 
  edges = defaultEdges, 
  activeNodeId = "1",
  className 
}: KnowledgeGraphProps) {
  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className={cn("relative w-full h-48", className)}>
      <svg 
        viewBox="0 0 200 220" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 8px hsl(var(--graph-node) / 0.3))' }}
      >
        {/* Edges */}
        {edges.map((edge, i) => {
          const fromNode = getNodeById(edge.from);
          const toNode = getNodeById(edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              className="stroke-graph-edge"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isActive = node.id === activeNodeId;
          return (
            <g key={node.id} className={isActive ? "node-pulse" : ""}>
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 12 : 8}
                className={cn(
                  "transition-all duration-300",
                  isActive 
                    ? "fill-graph-node stroke-graph-node" 
                    : "fill-secondary stroke-graph-edge"
                )}
                strokeWidth="2"
              />
              <text
                x={node.x}
                y={node.y + 24}
                textAnchor="middle"
                className={cn(
                  "text-[8px] font-mono",
                  isActive ? "fill-foreground" : "fill-muted-foreground"
                )}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
