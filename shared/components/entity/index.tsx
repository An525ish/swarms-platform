'use client';

import React, { PropsWithChildren, useEffect, useState } from 'react';
import Card3D, { CardBody, CardItem } from '@/shared/components/3d-card';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Share } from 'lucide-react';
import { useToast } from '../ui/Toasts/use-toast';
import { usePathname } from 'next/navigation';
import Avatar from '../avatar';
import { Button } from '../ui/Button';
import AgentRequirements, { RequirementProps } from './agent-requirements';
import ShareModal from '@/modules/platform/explorer/components/share-modal';

type UseCasesProps = { title: string; description: string };

interface Entity extends PropsWithChildren {
  name?: string;
  tags?: string[];
  title: string;
  language?: string;
  description?: string;
  usecases?: UseCasesProps[];
  prompt?: string;
  requirements?: RequirementProps[];
  userId?: string | null;
}

function UseCases({ usecases }: { usecases: UseCasesProps[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-4xl">Use Cases</h2>
      <div className="flex gap-2 flex-col md:flex-row">
        {usecases?.map((usecase) => (
          <Card3D containerClassName="flex-1 " className="inter-var w-full">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-[180px] rounded-xl p-6 border flex flex-col ">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {usecase.title}
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                {usecase.description}
              </CardItem>
            </CardBody>
          </Card3D>
        ))}
      </div>
    </div>
  );
}

export default function EntityComponent({
  title,
  name,
  tags,
  prompt,
  description,
  usecases,
  language,
  requirements,
  children,
  userId,
}: Entity) {
  const toast = useToast();
  const lang = title.toLowerCase() === 'agent' && language ? language : 'text';

  const pathName = usePathname();
  const [isShowShareModalOpen, setIsShowModalOpen] = useState<boolean>(false);

  async function copyToClipboard(text: string) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      toast.toast({ title: 'Copied to clipboard' });
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  }

  const handleShowShareModal = () => setIsShowModalOpen(true);
  const handleCloseModal = () => setIsShowModalOpen(false);

  const CustomPre = (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre id="customPreTag" {...props} />
  );

  return (
    <div className="max-w-6xl md:px-6 mx-auto">
      <div className="flex flex-col py-8 md:py-16">
        <div className="max-md:text-center">
          <h2>{title}</h2>
          {name && <h1 className="text-4xl md:text-6xl my-4">{name}</h1>}
          <Avatar
            userId={userId ?? ''}
            showUsername
            showBorder
            title={`${title} Author`}
          />
          {description && (
            <div className="mt-4 text-sm md:text-base text-gray-400">
              {description}
            </div>
          )}
          <div className="max-md:my-8 mb-2 max-md:flex max-md:flex-col max-md:items-center md:w-fit">
            <Button
              onClick={handleShowShareModal}
              variant="destructive"
              className="mt-3 w-full"
            >
              <Share size={20} />
              <span className="ml-2">Share</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mt-4 select-none flex-wrap">
          {tags?.map(
            (tag) =>
              tag.trim() && (
                <div className="text-sm px-2 py-1 rounded-2xl !text-red-500/70 border border-red-500/70">
                  {tag}
                </div>
              ),
          )}
        </div>
      </div>
      {usecases && <UseCases usecases={usecases} />}
      {title.toLowerCase() === 'agent' && (
        <AgentRequirements requirements={requirements as RequirementProps[]} />
      )}
      {prompt && (
        <div className="relative my-10">
          <div className="bg-[#00000080] border border-[#f9f9f959] shadow-2xl pt-7 md:p-5 md:py-7 rounded-lg leading-normal overflow-hidden no-scrollbar">
            <SyntaxHighlighter
              PreTag={CustomPre}
              style={dracula}
              language={lang}
              wrapLongLines
            >
              {prompt}
            </SyntaxHighlighter>
          </div>
          <Copy
            size={30}
            className="absolute top-2 right-2 p-1 text-primary cursor-pointer"
            onClick={() => copyToClipboard(prompt ?? '')}
          />
        </div>
      )}
      {children}
      <ShareModal
        isOpen={isShowShareModalOpen}
        onClose={handleCloseModal}
        link={pathName ?? ''}
      />
    </div>
  );
}
