class Subtask < ApplicationRecord
  belongs_to :task
  
  validates :title, presence: true
  validates :status, presence: true,
            inclusion: { in: ['To Do', 'In Progress', 'Completed'] }
  
  after_save :update_parent_task_status
  
  private
  
  def update_parent_task_status
    task.update_status_based_on_subtasks
  end
end