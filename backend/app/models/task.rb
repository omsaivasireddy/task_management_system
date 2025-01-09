class Task < ApplicationRecord
  belongs_to :user
  has_many :subtasks, dependent: :destroy
  
  validates :title, presence: true
  validates :status, presence: true,
            inclusion: { in: ['To Do', 'In Progress', 'Completed'] }
  
  def update_status_based_on_subtasks
    if subtasks.any?
      if subtasks.all? { |st| st.status == 'Completed' }
        update(status: 'Completed')
      elsif subtasks.any? { |st| st.status == 'In Progress' }
        update(status: 'In Progress')
      else
        update(status: 'To Do')
      end
    end
  end
end