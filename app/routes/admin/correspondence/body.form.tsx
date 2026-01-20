import { useForm } from "@/hooks";
import { useMemo } from "react";
import type { Evaluation } from "./model";
import { InputCustom } from "@/components/input.custom";
import { DateTimePickerCustom } from "@/components/date.custom";

interface Props {
  evaluationInit: Evaluation[];
  readOnly?: boolean;
  step: number;
  onValueChange: any;
  formState: any;
}
export const BodyForm = ({
  evaluationInit,
  readOnly = false,
  step,
  onValueChange,
  formState,
}: Props) => {

  const section = evaluationInit[step];
  return (
    <>
      {section.questions.map((q) => {
        const baseValue = formState[section.title][q.question];

        return (
          <div
            key={q.question}
            className="bg-white border rounded-xl p-3"
          >
            <label className="block font-semibold mb-3">
              {q.question}
            </label>

            {(q.typeAnswer === "text" ||
              q.typeAnswer === "longtext") && (
                <InputCustom
                  name={`${section.title}.${q.question}`}
                  value={baseValue.answer}
                  multiline={q.typeAnswer === "longtext"}
                  disabled={readOnly}
                  onChange={(e) =>
                    onValueChange(
                      `${section.title}.${q.question}.answer`,
                      e.target.value
                    )
                  }
                />
              )}

            {q.typeAnswer === "datetime" && (
              <DateTimePickerCustom
                name={`${section.title}.${q.question}`}
                mode="date"
                disabled={readOnly}
                value={
                  baseValue.answer
                    ? new Date(baseValue.answer)
                    : null
                }
                onChange={(val) =>
                  onValueChange(
                    `${section.title}.${q.question}.answer`,
                    val?.toISOString() ?? ""
                  )
                }
              />
            )}

            {(q.typeAnswer === "yes_no" ||
              q.typeAnswer === "scale_3") && (
                <div className="flex gap-3 mt-2">
                  {(q.typeAnswer === "yes_no"
                    ? ["Sí", "No"]
                    : ["No Adquirido", "En Proceso", "Adquirido"]
                  ).map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        disabled={readOnly}
                        checked={baseValue.answer === opt}
                        onChange={() =>
                          onValueChange(
                            `${section.title}.${q.question}.answer`,
                            opt
                          )
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

            {q.typeAnswer.includes("comment") && (
              <>
                <label className="flex items-center gap-2 mt-3 text-sm">
                  <input
                    type="checkbox"
                    disabled={readOnly}
                    checked={baseValue.enableComment}
                    onChange={(e) =>
                      onValueChange(
                        `${section.title}.${q.question}.enableComment`,
                        e.target.checked
                      )
                    }
                  />
                  Agregar comentario
                </label>

                {baseValue.enableComment && (
                  <InputCustom
                    name={`${section.title}.${q.question}`}
                    value={baseValue.comment}
                    multiline
                    disabled={readOnly}
                    onChange={(e) =>
                      onValueChange(
                        `${section.title}.${q.question}.comment`,
                        e.target.value
                      )
                    }
                    className="mt-2"
                  />
                )}
              </>
            )}
          </div>
        );
      })}
    </>
  )
}
