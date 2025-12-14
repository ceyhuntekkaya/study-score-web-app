// components/course/CourseNotes.tsx
import { useState } from "react";
import "@/style.css";

interface CourseNote {
  id: string;
  content: string;
  createdAt: Date;
  lessonId?: string;
  lessonPartId?: string;
  materialId?: string;
}

interface CourseNotesProps {
  courseId?: string;
  lessonId?: string | null;
  lessonPartId?: string | null;
  materialId?: string | null;
}

export function CourseNotes({
  courseId,
  lessonId,
  lessonPartId,
  materialId,
}: CourseNotesProps = {}) {
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Not anahtarı oluştur (local storage için)
  const getNoteKey = () => {
    if (materialId) return `notes_material_${materialId}`;
    if (lessonPartId) return `notes_part_${lessonPartId}`;
    if (lessonId) return `notes_lesson_${lessonId}`;
    return `notes_course_${courseId}`;
  };

  // Notları yükle
  /*
    useEffect(() => {
        const noteKey = getNoteKey();
        const savedNotes = localStorage.getItem(noteKey);
        if (savedNotes) {
            try {
                const parsed = JSON.parse(savedNotes);
                setNotes(parsed.map((note: any) => ({
                    ...note,
                    createdAt: new Date(note.createdAt)
                })));
            } catch (error) {
                console.error("Error loading notes:", error);
            }
        }
    }, [courseId, lessonId, lessonPartId, materialId]);
*/
  // Not kaydet
  const saveNote = () => {
    if (!newNote.trim()) return;

    setIsLoading(true);

    const note: CourseNote = {
      id: Date.now().toString(),
      content: newNote.trim(),
      createdAt: new Date(),
      lessonId: lessonId || undefined,
      lessonPartId: lessonPartId || undefined,
      materialId: materialId || undefined,
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);

    // Local storage'a kaydet
    const noteKey = getNoteKey();
    localStorage.setItem(noteKey, JSON.stringify(updatedNotes));

    setNewNote("");
    setIsLoading(false);
  };

  // Not düzenle
  const startEditing = (note: CourseNote) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  // Düzenlemeyi kaydet
  const saveEdit = (noteId: string) => {
    if (!editContent.trim()) return;

    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, content: editContent.trim() } : note
    );

    setNotes(updatedNotes);

    // Local storage'a kaydet
    const noteKey = getNoteKey();
    localStorage.setItem(noteKey, JSON.stringify(updatedNotes));

    setEditingNote(null);
    setEditContent("");
  };

  // Düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditingNote(null);
    setEditContent("");
  };

  // Not sil
  const deleteNote = (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    const updatedNotes = notes.filter((note) => note.id !== noteId);
    setNotes(updatedNotes);

    // Local storage'a kaydet
    const noteKey = getNoteKey();
    localStorage.setItem(noteKey, JSON.stringify(updatedNotes));
  };

  // Konteks metni oluştur
  const getContextText = () => {
    if (materialId) return "for this material";
    if (lessonPartId) return "for this lesson part";
    if (lessonId) return "for this lesson";
    return "for this course";
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-pencil me-2"></i>
            My Notes {getContextText()}
          </div>
          <small className="text-muted">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </small>
        </div>
      </div>
      <div className="card-body">
        {/* Yeni not ekleme */}
        <div className="mb-4">
          <textarea
            className="mb-3 custom-textarea"
            rows={3}
            placeholder={`Add your notes ${getContextText()}...`}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary static"
            onClick={saveNote}
            disabled={!newNote.trim() || isLoading}
          >
            <i className="bi bi-save me-2"></i>
            {isLoading ? "Saving..." : "Save Note"}
          </button>
        </div>

        {/* Notları listele */}
        {notes.length > 0 ? (
          <div className="notes-list">
            <h6 className="text-muted mb-3">Saved Notes</h6>
            {notes.map((note) => (
              <div key={note.id} className="card mb-3">
                <div className="card-body">
                  {editingNote === note.id ? (
                    <div>
                      <textarea
                        className="form-control mb-3"
                        rows={3}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => saveEdit(note.id)}
                          disabled={!editContent.trim()}
                        >
                          <i className="bi bi-check me-1"></i>
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={cancelEdit}
                        >
                          <i className="bi bi-x me-1"></i>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div
                        className="note-content mb-2"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {note.content}
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {note.createdAt.toLocaleDateString()}{" "}
                          {note.createdAt.toLocaleTimeString()}
                        </small>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEditing(note)}
                            title="Edit note"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteNote(note.id)}
                            title="Delete note"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted py-4">
            <i className="bi bi-journal-text fs-1 mb-3 d-block"></i>
            <p>No notes yet. Start taking notes {getContextText()}!</p>
          </div>
        )}
      </div>
    </div>
  );
}
