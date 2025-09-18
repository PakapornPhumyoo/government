import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ใช้ภาพจาก assets
import anutinImg from "../assets/anutin.jpg";
import phumthamImg from "../assets/phumtham.jpg";
import eknitiImg from "../assets/ekniti.jpg";
import auttapolImg from "../assets/auttapol.jpg";
import sihasakImg from "../assets/sihasak.jpg";

const MemberSchema = z.object({
  id: z.number().optional(),
  title: z.enum(["นาย", "นาง", "นางสาว"]).refine(val => val !== undefined, {
    message: "กรุณาเลือกคำนำหน้า",
  }),
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล"),
  photo: z.string().url("กรุณากรอก URL รูปภาพที่ถูกต้อง").optional().or(z.literal("")),
  workHistory: z.string().trim().min(1, "กรุณากรอกประวัติการทำงาน"),
  achievements: z.string().trim().min(1, "กรุณากรอกผลงานที่ผ่านมา"),
  position: z.string().trim().min(1, "กรุณากรอกตำแหน่งรัฐมนตรี"),
  ministry: z.string().trim().min(1, "กรุณากรอกกระทรวง"),
  party: z.string().trim().min(1, "กรุณากรอกสังกัดพรรคการเมือง"),
});

type Member = z.infer<typeof MemberSchema>;

const initialMembers: Member[] = [
  { id: 1, title: "นาย", firstName: "อนุทิน", lastName: "ชาญวีรกูล", photo: anutinImg, workHistory: "อดีตรัฐมนตรีสาธารณสุข และหัวหน้าพรรค", achievements: "นโยบายเรื่องกัญชา", position: "รองนายกรัฐมนตรี / รมว.มหาดไทย", ministry: "กระทรวงมหาดไทย", party: "ภูมิใจไทย" },
  { id: 2, title: "นาย", firstName: "ภูมิธรรม", lastName: "เวชยชัย", photo: phumthamImg, workHistory: "นักการเมืองอาวุโส", achievements: "งานด้านความมั่นคง", position: "รองนายกรัฐมนตรี / รมว.พาณิชย์", ministry: "กระทรวงพาณิชย์", party: "พรรคเพื่อไทย" },
  { id: 3, title: "นาย", firstName: "เอกนิติ", lastName: "นิติทัณฑ์ประภาศ", photo: eknitiImg, workHistory: "นักเศรษฐศาสตร์", achievements: "นโยบายการเงิน", position: "รัฐมนตรีว่าการกระทรวงการคลัง", ministry: "กระทรวงการคลัง", party: "อิสระ" },
  { id: 4, title: "นาย", firstName: "อรรถพล", lastName: "ฤกษ์พิบูลย์", photo: auttapolImg, workHistory: "ผู้บริหารด้านพลังงาน", achievements: "งานพัฒนาพลังงาน", position: "รัฐมนตรีว่าการกระทรวงพลังงาน", ministry: "กระทรวงพลังงาน", party: "อิสระ" },
  { id: 5, title: "นาย", firstName: "สีหศักดิ์ ", lastName: "พวงเกตุแก้ว", photo: sihasakImg, workHistory: "นักการทูตอาวุโส", achievements: "งานด้านการต่างประเทศ", position: "รัฐมนตรีช่วยว่าการกระทรวงการต่างประเทศ", ministry: "กระทรวงการต่างประเทศ", party: "อิสระ" }
];

export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Member>({
    resolver: zodResolver(MemberSchema),
    defaultValues: { title: "นาย", firstName: "", lastName: "", photo: "", workHistory: "", achievements: "", position: "", ministry: "", party: "" },
    mode: "onSubmit",
  });

  const openModal = (member: Member | null = null) => {
    if (member) {
      setEditingMember(member);
      reset(member);
    } else {
      setEditingMember(null);
      reset({ title: "นาย", firstName: "", lastName: "", photo: "", workHistory: "", achievements: "", position: "", ministry: "", party: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const onSave = (data: Member) => {
    if (editingMember && editingMember.id) {
      setMembers(prev => prev.map(member => member.id === editingMember.id ? { ...data, id: editingMember.id } : member));
    } else {
      const newMember = { ...data, id: Math.max(0, ...members.map(m => m.id || 0)) + 1 };
      setMembers(prev => [...prev, newMember]);
    }
    closeModal();
  };

  const onDelete = (id: number) => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบสมาชิกคนนี้?")) {
      setMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full h-full overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-blue-800 mb-4 md:mb-0">ทำเนียบสมาชิกสภาผู้แทนราษฎร</h1>
            <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition duration-300 shadow-md hover:shadow-lg">
              เพิ่มสมาชิก
            </button>
          </div>

          {/* ตารางสมาชิก */}
          <div className="flex-1 overflow-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-700 text-white sticky top-0">
                <tr>
                  <th className="py-4 px-6 text-left">รูปถ่าย</th>
                  <th className="py-4 px-6 text-left">ชื่อ-นามสกุล</th>
                  <th className="py-4 px-6 text-left">ตำแหน่ง/กระทรวง</th>
                  <th className="py-4 px-6 text-left">พรรคการเมือง</th>
                  <th className="py-4 px-6 text-center">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-blue-50 transition duration-150">
                    <td className="py-4 px-6 flex justify-center">
                      {member.photo ? (
                        <img src={member.photo} alt={`${member.firstName} ${member.lastName}`} className="w-16 h-16 object-cover rounded-full border-2 border-blue-200" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-blue-200">
                          <span className="text-gray-500 text-xs">ไม่มีรูป</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">{member.title} {member.firstName} {member.lastName}</td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{member.position}</div>
                      <div className="text-sm text-gray-600">{member.ministry}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{member.party}</span>
                    </td>
                    <td className="py-4 px-6 flex justify-center space-x-3">
                      <button onClick={() => openModal(member)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition duration-200">แก้ไข</button>
                      <button onClick={() => member.id && onDelete(member.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition duration-200">ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full h-full overflow-y-auto p-8">
            <div className="flex justify-between items-center border-b border-gray-200 mb-4">
              <h2 className="text-xl font-semibold">{editingMember ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มสมาชิกใหม่"}</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">ปิด</button>
            </div>

            <form onSubmit={handleSubmit(onSave)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* คำนำหน้า */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">คำนำหน้า *</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("title")}>
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                {/* ชื่อ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ *</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("firstName")} />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                </div>

                {/* นามสกุล */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">นามสกุล *</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("lastName")} />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                </div>

                {/* URL รูปภาพ */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ (ไม่บังคับ)</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="https://example.com/photo.jpg" {...register("photo")} />
                  {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo.message}</p>}
                </div>

                {/* ประวัติการทำงาน */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ประวัติการทำงาน *</label>
                  <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("workHistory")} />
                  {errors.workHistory && <p className="mt-1 text-sm text-red-600">{errors.workHistory.message}</p>}
                </div>

                {/* ผลงานที่ผ่านมา */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ผลงานที่ผ่านมา *</label>
                  <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("achievements")} />
                  {errors.achievements && <p className="mt-1 text-sm text-red-600">{errors.achievements.message}</p>}
                </div>

                {/* ตำแหน่งรัฐมนตรี */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่งรัฐมนตรี *</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("position")} />
                  {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>}
                </div>

                {/* กระทรวง */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">กระทรวง *</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("ministry")} />
                  {errors.ministry && <p className="mt-1 text-sm text-red-600">{errors.ministry.message}</p>}
                </div>

                {/* สังกัดพรรคการเมือง */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">สังกัดพรรคการเมือง *</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" {...register("party")} />
                  {errors.party && <p className="mt-1 text-sm text-red-600">{errors.party.message}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200">ยกเลิก</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition duration-200 shadow-md hover:shadow-lg">{editingMember ? "อัปเดตข้อมูล" : "เพิ่มสมาชิก"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
