'use client';

import { trpc } from '@/shared/utils/trpc/trpc';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import AddSwarmModal from './components/add-swarm-modal';
import Input from '@/shared/components/ui/Input';
import useModels from './hook/models';
import { explorerOptions } from '@/shared/constants/explorer';
import AddPromptModal from './components/add-prompt-modal';
import Models from './components/content/models';
import { Activity } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import AddAgentModal from './components/add-agent-modal';
import dynamic from 'next/dynamic';
import Sticky from 'react-stickynode';

const Prompts = dynamic(() => import('./components/content/prompts'), {
  ssr: false,
});
const Agents = dynamic(() => import('./components/content/agents'), {
  ssr: false,
});
const Swarms = dynamic(() => import('./components/content/swarms'), {
  ssr: false,
});
const Explorer = () => {
  const models = trpc.explorer.getModels.useQuery();
  const allSwarms = trpc.explorer.getAllApprovedSwarms.useQuery();
  const pendingSwarms = trpc.explorer.getMyPendingSwarms.useQuery();

  const isLoading = allSwarms.isLoading || pendingSwarms.isLoading;
  const reloadSwarmStatus = trpc.explorer.reloadSwarmStatus.useMutation();

  // Prompts
  const allPrompts = trpc.explorer.getAllPrompts.useQuery();

  // Agents
  const allAgents = trpc.explorer.getAllAgents.useQuery();

  const [addSwarModalOpen, setAddSwarmModalOpen] = useState(false);
  const [addPromptModalOpen, setAddPromptModalOpen] = useState(false);
  const [addAgentModalOpen, setAddAgentModalOpen] = useState(false);

  const {
    filteredModels,
    filteredSwarms,
    filteredPrompts,
    filteredAgents,
    search,
    options,
    filterOption,
    isDataLoading,
    handleSearchChange,
    handleOptionChange,
  } = useModels();

  useEffect(() => {
    if (!pendingSwarms.isLoading && pendingSwarms.data) {
      pendingSwarms.data?.data?.forEach((swarm) => {
        reloadSwarmStatus.mutateAsync(swarm.id).then((res) => {
          if (res != swarm.status) {
            pendingSwarms.refetch();
          }
        });
      });
    }
  }, [pendingSwarms.isLoading]);
  const onAddSuccessfuly = () => {
    pendingSwarms.refetch();
  };

  const onAddPrompt = () => {
    allPrompts.refetch();
  };

  const onAddAgent = () => {
    allAgents.refetch();
  };

  const elements = [
    { key: 'models', content: <Models {...{ models, filteredModels }} /> },
    {
      key: 'prompts',
      content: (
        <Prompts {...{ allPrompts, filteredPrompts, setAddPromptModalOpen }} />
      ),
    },
    {
      key: 'agents',
      content: (
        <Agents {...{ allAgents, filteredAgents, setAddAgentModalOpen }} />
      ),
    },
    {
      key: 'swarms',
      content: (
        <Swarms
          {...{
            isLoading,
            pendingSwarms,
            filteredSwarms,
            setAddSwarmModalOpen,
          }}
        />
      ),
    },
  ];

  // Rearrange elements based on filterOption
  const reorderedElements = elements.sort((a, b) => {
    if (a.key === filterOption) return -1;
    if (b.key === filterOption) return 1;
    return 0;
  });

  return (
    <>
      <AddSwarmModal
        onAddSuccessfuly={onAddSuccessfuly}
        isOpen={addSwarModalOpen}
        onClose={() => setAddSwarmModalOpen(false)}
      />
      <AddPromptModal
        onAddSuccessfully={onAddPrompt}
        isOpen={addPromptModalOpen}
        onClose={() => setAddPromptModalOpen(false)}
      />
      <AddAgentModal
        onAddSuccessfully={onAddAgent}
        isOpen={addAgentModalOpen}
        onClose={() => setAddAgentModalOpen(false)}
      />
      <div className="w-full flex flex-col h-full">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Explorer</h1>
          <span className="mt-4 text-muted-foreground">
            Find which one that suits your task such as accounting, finance,
            marketing, etc.
          </span>
        </div>
        <Sticky enabled top={48} className='z-10'>
          <div className="mt-8 pb-4 bg-white dark:bg-black">
            <ul className="p-0 mb-2 flex items-center flex-wrap gap-3">
              {options.map((option) => {
                const colorSelector = isDataLoading
                  ? 'text-primary'
                  : filterOption === option || filterOption === 'all'
                    ? 'text-green-500'
                    : 'text-primary';
                return (
                  <li
                    key={option}
                    className={cn(
                      'shadow cursor-pointer capitalize text-center rounded-sm flex items-center justify-center bg-secondary text-foreground w-24 p-1 px-2 text-xs md:text-sm',
                      colorSelector,
                    )}
                  >
                    {option}
                    <Activity
                      size={15}
                      className={cn('ml-2 font-bold', colorSelector)}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search..."
                onChange={handleSearchChange}
                value={search}
                disabled={isDataLoading}
                className="disabled:cursor-not-allowed disabled:opacity-50"
              />

              <Select
                onValueChange={(value) => {
                  handleOptionChange(value);
                }}
                disabled={isDataLoading}
                value={filterOption}
              >
                <SelectTrigger className="w-1/2 xl:w-1/4 cursor-pointer">
                  <SelectValue placeholder={filterOption} />
                </SelectTrigger>
                <SelectContent>
                  {explorerOptions?.map((option) => (
                    <SelectItem key={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Sticky>
        <div className="flex flex-col h-full">
          {reorderedElements.map(({ content }) => content)}
        </div>
      </div>
    </>
  );
};

export default Explorer;
