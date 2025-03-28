"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, name, index }: { id: number; name: string; index: number }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center p-4 mb-2 bg-white rounded-lg shadow cursor-move hover:bg-gray-50"
    >
      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mr-4">
        <span className="text-xl font-bold text-blue-600">{index + 1}</span>
      </div>
      <div className="flex-1">
        <span className="text-gray-700">{name}</span>
      </div>
      <div className="text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
    </div>
  );
};

export default function VotePage({ params }: { params: { groupId: Promise<string> } }) {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [members, setMembers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [voterName, setVoterName] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const voterId = searchParams.get('voterId');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchGroupId = async () => {
      const id = await params.groupId;
      setGroupId(id);
    };
    fetchGroupId();
  }, [params.groupId]);

  useEffect(() => {
    if (!voterId || !groupId) {
      if (!voterId) {
        alert('投票者IDが必要です');
      }
      return;
    }

    const fetchData = async () => {
      // メンバー一覧を取得
      const membersRes = await fetch(`/api/members?groupId=${groupId}`);
      const membersData = await membersRes.json();
      setMembers(membersData.members);

      // 投票者の名前を特定
      const voter = membersData.members.find((m: { id: string }) => m.id === voterId);
      if (voter) {
        setVoterName(voter.name);
      }
    };
    fetchData();
  }, [groupId, voterId]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setMembers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const submitVote = async () => {
    if (!voterId || !groupId) {
      alert('投票者IDが必要です');
      return;
    }

    setLoading(true);
    const rankings = members.map((member, index) => ({
      memberId: member.id,
      rank: index + 1
    }));

    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        groupId, 
        rankings,
        voterId
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    router.push(`/vote-complete/${groupId}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-sm text-gray-600 mb-2">投票者: {voterName}さん</div>
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">投票</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">メンバーをドラッグ&ドロップして順位を決定してください</p>
          <div className="space-y-2 mb-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={members.map(m => m.id)}
                strategy={verticalListSortingStrategy}
              >
                {members.map((member, index) => (
                  <SortableItem key={member.id} {...member} index={index} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          
          <button 
            onClick={submitVote} 
            disabled={loading}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "投票中..." : "投票する"}
          </button>
        </div>
      </div>
    </main>
  );
}
