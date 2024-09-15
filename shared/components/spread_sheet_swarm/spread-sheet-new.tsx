/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/dwLvtwItCYa
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from './ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';

export function SpreadSheetNew() {
  const [agents, setAgents] = useState([
    {
      id: 'agent1',
      name: 'Agent 1',
      role: 'Researcher',
      description: 'Analyzes market trends and writes reports',
      status: 'Active',
      tasks: ['Analyze market trends', 'Write report'],
      llm: 'GPT-3',
      output: '',
    },
    {
      id: 'agent2',
      name: 'Agent 2',
      role: 'Writer',
      description: 'Drafts blog posts and edits website content',
      status: 'Active',
      tasks: ['Draft blog post', 'Edit website content'],
      llm: 'GPT-J',
      output: '',
    },
    {
      id: 'agent3',
      name: 'Agent 3',
      role: 'Developer',
      description: 'Builds new features and fixes bugs',
      status: 'Active',
      tasks: ['Build new feature', 'Fix bug'],
      llm: 'Codex',
      output: '',
    },
  ]);
  const [newAgent, setNewAgent] = useState({
    id: '',
    name: '',
    role: '',
    description: '',
    status: 'Active',
    tasks: [],
    llm: '',
    output: '',
  });
  const [newTask, setNewTask] = useState('');
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => ({
          ...agent,
          tasks: [...agent.tasks, newTask.trim()],
        })),
      );
      setNewTask('');
    }
  };
  const handleAddAgent = () => {
    setShowAddAgentModal(true);
  };
  const handleSaveAgent = () => {
    if (
      newAgent.name.trim() !== '' &&
      newAgent.role.trim() !== '' &&
      newAgent.llm.trim() !== ''
    ) {
      setAgents([...agents, newAgent]);
      setNewAgent({
        id: '',
        name: '',
        role: '',
        description: '',
        status: 'Active',
        tasks: [],
        llm: '',
        output: '',
      });
      setShowAddAgentModal(false);
    }
  };
  const handleRunAgents = () => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => ({
        ...agent,
        output: agent.tasks
          .map((task) => `${agent.name} completed task: ${task}`)
          .join('\n'),
      })),
    );
  };
  const handleDeleteAgent = (id: any) => {
    setAgents((prevAgents) => prevAgents.filter((agent) => agent.id !== id));
  };
  const handleDownloadCSV = () => {
    const csvData = [
      ['Name', 'Role', 'Description', 'Status', 'Tasks', 'LLM', 'Output'],
      ...agents.map((agent) => [
        agent.name,
        agent.role,
        agent.description,
        agent.status,
        agent.tasks.join(', '),
        agent.llm,
        agent.output,
      ]),
    ];
    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'swarm_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Agents</CardTitle>
            <CardDescription>{agents.length}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks Executed</CardTitle>
            <CardDescription>
              {agents.reduce((total, agent) => total + agent.tasks.length, 0)}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Saved</CardTitle>
            <CardDescription>120 hours</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Run new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
        <Button onClick={handleAddTask}>Run Task</Button>
        <Button onClick={handleAddAgent}>Add Agent</Button>
        <Button variant="outline" onClick={handleDownloadCSV}>
          Download CSV
        </Button>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={handleRunAgents}>
            <PlayIcon className="h-4 w-4" />
            <span className="sr-only">Run Agents</span>
          </Button>
          <Button variant="outline">
            <ShareIcon className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="outline">
            <GlobeIcon className="h-4 w-4" />
            <span className="sr-only">Make Public</span>
          </Button>
        </div>
      </div>
      <Dialog open={showAddAgentModal} onOpenChange={setShowAddAgentModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Fill in the details for the new agent.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newAgent.name}
                onChange={(e) =>
                  setNewAgent((prevAgent) => ({
                    ...prevAgent,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={newAgent.role}
                onChange={(e) =>
                  setNewAgent((prevAgent) => ({
                    ...prevAgent,
                    role: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAgent.description}
                onChange={(e) =>
                  setNewAgent((prevAgent) => ({
                    ...prevAgent,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="llm">LLM</Label>
              <Input
                id="llm"
                value={newAgent.llm}
                onChange={(e) =>
                  setNewAgent((prevAgent) => ({
                    ...prevAgent,
                    llm: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddAgentModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAgent}>Save Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>LLM</TableHead>
            <TableHead>Output</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.role}</TableCell>
              <TableCell>{agent.description}</TableCell>
              <TableCell>{agent.status}</TableCell>
              <TableCell>
                <ul className="list-disc pl-4">
                  {agent.tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>{agent.llm}</TableCell>
              <TableCell>{agent.output || 'Idle'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoveHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Agent actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function GlobeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function MoveHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}

// This is a generated component from the V0 API.
function PlayIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function ShareIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}
