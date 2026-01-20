import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  SelectCustom,
} from "@/components";
import {
  useCorrespondenceStore,
  useForm,
  useStaffStore,
} from "@/hooks";
import type { Evaluation } from "./model";
import { BodyForm } from "./body.form";

interface Props {
  evaluationInit: Evaluation[];
  onBack?: () => void;
  readOnly?: boolean;
  title: string;
}
const EvaluationForm = ({
  evaluationInit,
  onBack,
  readOnly = false,
  title,
}: Props) => {

  const [step, setStep] = useState(0);
  const section = evaluationInit[step];

  const next = () => setStep((s) => Math.min(s + 1, evaluationInit.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const bodyRef = useRef<HTMLDivElement>(null);


  const progress = ((step + 1) / evaluationInit.length) * 100;

  // form
  const initialForm = useMemo(() => {
    return evaluationInit.reduce((acc, section) => {
      acc[section.title] = section.questions.reduce((qAcc, q) => {
        qAcc[q.question] = {
          question: q.question,
          typeAnswer: q.typeAnswer,
          answer: q.answer ?? "",
          ...(q.typeAnswer.includes("comment")
            ? {
              comment: q.comment ?? "",
              enableComment: q.enableComment ?? false,
            }
            : {}),
        };
        return qAcc;
      }, {} as Record<string, any>);
      return acc;
    }, {} as Record<string, Record<string, any>>);
  }, [evaluationInit]);

  const { formState, onValueChange } = useForm(initialForm);

  const { createCorrespondence } = useCorrespondenceStore();
  const { dataStaff, getStaffs } = useStaffStore();

  const [receiver, setReceiver] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!readOnly) getStaffs();
  }, [readOnly]);

  const finish = async () => {
    if (!receiver) {
      alert("Selecciona un destinatario");
      return;
    }

    const result: Evaluation[] = Object.entries(formState).map(
      ([title, questions]: any) => ({
        title,
        questions: Object.values(questions).map((q: any) => ({
          question: q.question,
          typeAnswer: q.typeAnswer,
          answer: q.answer,
          ...(q.comment !== undefined ? { comment: q.comment } : {}),
          ...(q.enableComment !== undefined
            ? { enableComment: q.enableComment }
            : {}),
        })),
      })
    );

    await createCorrespondence({
      type: title,
      data: result,
      receiverId: receiver.id,
    });

    onBack?.();
  };
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [step]);

  return (
    <div className="max-w-4xl mx-auto h-[85vh] flex flex-col bg-white rounded-lg overflow-hidden">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b px-6 pt-6 pb-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Volver
          </Button>
        )}

        <h1 className="text-2xl font-bold">
          {title}
        </h1>

        {readOnly && (
          <div className="mt-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded">
            Modo solo lectura — esta evaluación no puede modificarse
          </div>
        )}
      </div>

      {/* PROGRESS */}
      <div className="sticky top-[96px] z-10 bg-white px-6 py-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{section.title}</span>
          <span>{step + 1} / {evaluationInit.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-purple-600 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* BODY */}
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-6 py-2 space-y-2"
      >
        <BodyForm
          step={step}
          evaluationInit={evaluationInit}
          readOnly={readOnly}
          onValueChange={onValueChange}
          formState={formState}
        />
      </div>

      {/* FOOTER */}
      <div className="sticky bottom-0 z-20 bg-white border-t px-6 flex justify-between items-center">
        <div>
          {step > 0 && (
            <Button variant="outline" onClick={prev}>
              Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-3 items-center">
          {step < evaluationInit.length - 1 && (
            <Button onClick={next}>Siguiente</Button>
          )}

          {step === evaluationInit.length - 1 && !readOnly && (
            <div className="flex flex-col gap-3 items-end">
              <SelectCustom
                label="Enviar a"
                options={
                  dataStaff.data?.map((s) => ({
                    id: s.userId,
                    value: `${s.user.name} ${s.user.lastName}`,
                  })) ?? []
                }
                selected={
                  receiver
                    ? { id: receiver.id, value: receiver.name }
                    : null
                }
                onSelect={(v) =>
                  v &&
                  !Array.isArray(v) &&
                  setReceiver({
                    id: v.id,
                    name: v.value,
                  })
                }
              />

              <Button onClick={finish} className="w-full">
                Finalizar y Enviar
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;
